use std::str::FromStr;

use async_trait::async_trait;
use cosmrs::cosmwasm::MsgExecuteContract;
use cosmrs::crypto::PublicKey;
use cosmrs::tx::{MessageExt, SequenceNumber, SignerInfo, SignerPublicKey};
use cosmrs::{proto, AccountId, Any, Coin, Tx};
use itertools::Itertools;
use once_cell::sync::Lazy;
use tendermint::hash::Algorithm;
use tendermint::Hash;
use tendermint_rpc::{client::CompatMode, Client, HttpClient};
use time::OffsetDateTime;
use tracing::{error, warn};

use crypto::decompress_public_key;
use hyperlane_core::{
    AccountAddressType, BlockInfo, ChainCommunicationError, ChainInfo, ChainResult,
    ContractLocator, HyperlaneChain, HyperlaneDomain, HyperlaneProvider, TxnInfo, TxnReceiptInfo,
    H256, U256,
};

use crate::grpc::{WasmGrpcProvider, WasmProvider};
use crate::providers::rpc::CosmosRpcClient;
use crate::{
    ConnectionConf, CosmosAccountId, CosmosAddress, CosmosAmount, HyperlaneCosmosError, Signer,
};

/// Exponent value for atto units (10^-18).
const ATTO_EXPONENT: u32 = 18;

/// Injective public key type URL for protobuf Any
const INJECTIVE_PUBLIC_KEY_TYPE_URL: &str = "/injective.crypto.v1beta1.ethsecp256k1.PubKey";

/// Abstraction over a connection to a Cosmos chain
#[derive(Debug, Clone)]
pub struct CosmosProvider {
    domain: HyperlaneDomain,
    connection_conf: ConnectionConf,
    grpc_provider: WasmGrpcProvider,
    rpc_client: CosmosRpcClient,
}

impl CosmosProvider {
    /// Create a reference to a Cosmos chain
    pub fn new(
        domain: HyperlaneDomain,
        conf: ConnectionConf,
        locator: ContractLocator,
        signer: Option<Signer>,
    ) -> ChainResult<Self> {
        let gas_price = CosmosAmount::try_from(conf.get_minimum_gas_price().clone())?;
        let grpc_provider = WasmGrpcProvider::new(
            domain.clone(),
            conf.clone(),
            gas_price.clone(),
            locator,
            signer,
        )?;
        let rpc_client = CosmosRpcClient::new(&conf)?;

        Ok(Self {
            domain,
            connection_conf: conf,
            grpc_provider,
            rpc_client,
        })
    }

    /// Get a grpc client
    pub fn grpc(&self) -> &WasmGrpcProvider {
        &self.grpc_provider
    }

    fn search_payer_in_signer_infos(
        &self,
        signer_infos: &[SignerInfo],
        payer: &AccountId,
    ) -> ChainResult<(AccountId, SequenceNumber)> {
        signer_infos
            .iter()
            .map(|si| self.convert_signer_info_into_account_id_and_nonce(si))
            // After the following we have a single Ok entry and, possibly, many Err entries
            .filter_ok(|(a, s)| payer == a)
            // If we have Ok entry, use it since it is the payer, if not, use the first entry with error
            .find_or_first(|r| match r {
                Ok((a, s)) => payer == a,
                Err(e) => false,
            })
            // If there were not any signer info with non-empty public key or no signers for the transaction,
            // we get None here
            .unwrap_or_else(|| Err(ChainCommunicationError::from_other_str("no signer info")))
    }

    fn convert_signer_info_into_account_id_and_nonce(
        &self,
        signer_info: &SignerInfo,
    ) -> ChainResult<(AccountId, SequenceNumber)> {
        let signer_public_key = signer_info.public_key.clone().ok_or_else(|| {
            HyperlaneCosmosError::PublicKeyError("no public key for default signer".to_owned())
        })?;

        let (key, account_address_type) = self.normalize_public_key(signer_public_key)?;
        let public_key = PublicKey::try_from(key)?;

        let account_id = CosmosAccountId::account_id_from_pubkey(
            public_key,
            &self.connection_conf.get_bech32_prefix(),
            &account_address_type,
        )?;

        Ok((account_id, signer_info.sequence))
    }

    fn normalize_public_key(
        &self,
        signer_public_key: SignerPublicKey,
    ) -> ChainResult<(SignerPublicKey, AccountAddressType)> {
        let public_key_and_account_address_type = match signer_public_key {
            SignerPublicKey::Single(pk) => (SignerPublicKey::from(pk), AccountAddressType::Bitcoin),
            SignerPublicKey::LegacyAminoMultisig(pk) => {
                (SignerPublicKey::from(pk), AccountAddressType::Bitcoin)
            }
            SignerPublicKey::Any(pk) => {
                if pk.type_url != PublicKey::ED25519_TYPE_URL
                    && pk.type_url != PublicKey::SECP256K1_TYPE_URL
                    && pk.type_url != INJECTIVE_PUBLIC_KEY_TYPE_URL
                {
                    let msg = format!(
                        "can only normalize public keys with a known TYPE_URL: {}, {}, {}",
                        PublicKey::ED25519_TYPE_URL,
                        PublicKey::SECP256K1_TYPE_URL,
                        INJECTIVE_PUBLIC_KEY_TYPE_URL
                    );
                    warn!(pk.type_url, msg);
                    Err(HyperlaneCosmosError::PublicKeyError(msg.to_owned()))?
                }

                let (pub_key, account_address_type) =
                    if pk.type_url == INJECTIVE_PUBLIC_KEY_TYPE_URL {
                        let any = Any {
                            type_url: PublicKey::SECP256K1_TYPE_URL.to_owned(),
                            value: pk.value,
                        };

                        let proto = proto::cosmos::crypto::secp256k1::PubKey::from_any(&any)
                            .map_err(Into::<HyperlaneCosmosError>::into)?;

                        let decompressed = decompress_public_key(&proto.key)
                            .map_err(|e| HyperlaneCosmosError::PublicKeyError(e.to_string()))?;

                        let tendermint = tendermint::PublicKey::from_raw_secp256k1(&decompressed)
                            .ok_or_else(|| {
                            HyperlaneCosmosError::PublicKeyError(
                                "cannot create tendermint public key".to_owned(),
                            )
                        })?;

                        (PublicKey::from(tendermint), AccountAddressType::Ethereum)
                    } else {
                        (PublicKey::try_from(pk)?, AccountAddressType::Bitcoin)
                    };

                (SignerPublicKey::Single(pub_key), account_address_type)
            }
        };

        Ok(public_key_and_account_address_type)
    }

    /// Calculates the sender and the nonce for the transaction.
    /// We use `payer` of the fees as the sender of the transaction, and we search for `payer`
    /// signature information to find the nonce.
    /// If `payer` is not specified, we use the account which signed the transaction first, as
    /// the sender.
    fn sender_and_nonce(&self, tx: &Tx) -> ChainResult<(H256, SequenceNumber)> {
        let (sender, nonce) = tx
            .auth_info
            .fee
            .payer
            .as_ref()
            .map(|payer| self.search_payer_in_signer_infos(&tx.auth_info.signer_infos, payer))
            .map_or_else(
                || {
                    #[allow(clippy::get_first)] // TODO: `rustc` 1.80.1 clippy issue
                    let signer_info = tx.auth_info.signer_infos.get(0).ok_or_else(|| {
                        HyperlaneCosmosError::SignerInfoError(
                            "no signer info in default signer".to_owned(),
                        )
                    })?;
                    self.convert_signer_info_into_account_id_and_nonce(signer_info)
                },
                |p| p,
            )
            .map(|(a, n)| CosmosAddress::from_account_id(a).map(|a| (a.digest(), n)))??;
        Ok((sender, nonce))
    }

    /// Extract contract address from transaction.
    /// Assumes that there is only one `MsgExecuteContract` message in the transaction
    fn contract(tx: &Tx, tx_hash: &H256) -> ChainResult<H256> {
        use cosmrs::proto::cosmwasm::wasm::v1::MsgExecuteContract as ProtoMsgExecuteContract;

        let contract_execution_messages = tx
            .body
            .messages
            .iter()
            .filter(|a| a.type_url == "/cosmwasm.wasm.v1.MsgExecuteContract")
            .cloned()
            .collect::<Vec<Any>>();

        let contract_execution_messages_len = contract_execution_messages.len();
        if contract_execution_messages_len > 1 {
            let msg = "transaction contains multiple contract execution messages, we are indexing the first entry only";
            warn!(?tx_hash, ?contract_execution_messages, msg);
            Err(ChainCommunicationError::CustomError(msg.to_owned()))?
        }

        let any = contract_execution_messages.first().ok_or_else(|| {
            let msg = "could not find contract execution message";
            warn!(?tx_hash, msg);
            ChainCommunicationError::from_other_str(msg)
        })?;
        let proto =
            ProtoMsgExecuteContract::from_any(any).map_err(Into::<HyperlaneCosmosError>::into)?;
        let msg = MsgExecuteContract::try_from(proto)?;
        let contract = H256::try_from(CosmosAccountId::new(&msg.contract))?;
        Ok(contract)
    }

    /// Reports if transaction contains fees expressed in unsupported denominations
    /// The only denomination we support at the moment is the one we express gas minimum price
    /// in the configuration of a chain. If fees contain an entry in a different denomination,
    /// we report it in the logs.
    fn report_unsupported_denominations(&self, tx: &Tx, tx_hash: &H256) -> ChainResult<()> {
        let supported_denomination = self.connection_conf.get_minimum_gas_price().denom;
        let unsupported_denominations = tx
            .auth_info
            .fee
            .amount
            .iter()
            .filter(|c| c.denom.as_ref() != supported_denomination)
            .map(|c| c.denom.as_ref())
            .fold("".to_string(), |acc, denom| acc + ", " + denom);

        if !unsupported_denominations.is_empty() {
            let msg = "transaction contains fees in unsupported denominations, manual intervention is required";
            warn!(
                ?tx_hash,
                ?supported_denomination,
                ?unsupported_denominations,
                msg,
            );
            Err(ChainCommunicationError::CustomError(msg.to_owned()))?
        }

        Ok(())
    }

    /// Converts fees to a common denomination if necessary.
    ///
    /// Currently, we support Injective, Neutron and Osmosis. Fees in Injective are usually
    /// expressed in `inj` which is 10^-18 of `INJ`, while fees in Neutron and Osmosis are
    /// usually expressed in `untrn` and `uosmo`, respectively, which are 10^-6 of corresponding
    /// `NTRN` and `OSMO`.
    ///
    /// This function will convert fees expressed in `untrn` and `uosmo` to 10^-18 of `NTRN` and
    /// `OSMO` and it will keep fees expressed in `inj` as is.
    ///
    /// If fees are expressed in an unsupported denomination, they will be ignored.
    fn convert_fee(&self, coin: &Coin) -> U256 {
        let native_token = self.connection_conf.get_native_token();

        if coin.denom.as_ref() != native_token.denom {
            return U256::zero();
        }

        let exponent = ATTO_EXPONENT - native_token.decimals;
        let coefficient = U256::from(10u128.pow(exponent));

        let amount_in_native_denom = U256::from(coin.amount);

        amount_in_native_denom * coefficient
    }
}

impl HyperlaneChain for CosmosProvider {
    fn domain(&self) -> &HyperlaneDomain {
        &self.domain
    }

    fn provider(&self) -> Box<dyn HyperlaneProvider> {
        Box::new(self.clone())
    }
}

#[async_trait]
impl HyperlaneProvider for CosmosProvider {
    async fn get_block_by_hash(&self, hash: &H256) -> ChainResult<BlockInfo> {
        let tendermint_hash = Hash::from_bytes(Algorithm::Sha256, hash.as_bytes())
            .expect("block hash should be of correct size");

        let response = self.rpc_client.get_block_by_hash(tendermint_hash).await?;

        let received_hash = H256::from_slice(response.block_id.hash.as_bytes());

        if &received_hash != hash {
            return Err(ChainCommunicationError::from_other_str(
                &format!("received incorrect block, expected hash: {hash:?}, received hash: {received_hash:?}")
            ));
        }

        let block = response.block.ok_or_else(|| {
            ChainCommunicationError::from_other_str(&format!(
                "empty block info for block: {:?}",
                hash
            ))
        })?;

        let time: OffsetDateTime = block.header.time.into();

        let block_info = BlockInfo {
            hash: hash.to_owned(),
            timestamp: time.unix_timestamp() as u64,
            number: block.header.height.value(),
        };

        Ok(block_info)
    }

    async fn get_txn_by_hash(&self, hash: &H256) -> ChainResult<TxnInfo> {
        let tendermint_hash = Hash::from_bytes(Algorithm::Sha256, hash.as_bytes())
            .expect("transaction hash should be of correct size");

        let response = self.rpc_client.get_tx_by_hash(tendermint_hash).await?;

        let received_hash = H256::from_slice(response.hash.as_bytes());

        if &received_hash != hash {
            return Err(ChainCommunicationError::from_other_str(&format!(
                "received incorrect transaction, expected hash: {:?}, received hash: {:?}",
                hash, received_hash,
            )));
        }

        let tx = Tx::from_bytes(&response.tx)?;

        let contract = Self::contract(&tx, hash)?;
        let (sender, nonce) = self.sender_and_nonce(&tx)?;

        // TODO support multiple denominations for amount
        self.report_unsupported_denominations(&tx, hash)?;

        let gas_limit = U256::from(tx.auth_info.fee.gas_limit);
        let fee = tx
            .auth_info
            .fee
            .amount
            .iter()
            .map(|c| self.convert_fee(c))
            .fold(U256::zero(), |acc, v| acc + v);

        let gas_price = fee / gas_limit;
        let gas_price = if gas_price == U256::zero() {
            warn!(?fee, ?gas_limit, "calculated zero gas price");
            U256::one()
        } else {
            gas_price
        };

        let tx_info = TxnInfo {
            hash: hash.to_owned(),
            gas_limit: U256::from(response.tx_result.gas_wanted),
            max_priority_fee_per_gas: None,
            max_fee_per_gas: None,
            gas_price: Some(gas_price),
            nonce,
            sender,
            recipient: Some(contract),
            receipt: Some(TxnReceiptInfo {
                gas_used: U256::from(response.tx_result.gas_used),
                cumulative_gas_used: U256::from(response.tx_result.gas_used),
                effective_gas_price: Some(gas_price),
            }),
        };

        Ok(tx_info)
    }

    async fn is_contract(&self, address: &H256) -> ChainResult<bool> {
        match self.grpc_provider.wasm_contract_info().await {
            Ok(c) => Ok(true),
            Err(e) => Ok(false),
        }
    }

    async fn get_balance(&self, address: String) -> ChainResult<U256> {
        Ok(self
            .grpc_provider
            .get_balance(address, self.connection_conf.get_canonical_asset())
            .await?)
    }

    async fn get_chain_metrics(&self) -> ChainResult<Option<ChainInfo>> {
        Ok(None)
    }
}