/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Home, HomeInterface } from "../Home";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_localDomain",
        type: "uint32",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "root",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "Checkpoint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "messageHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "leafIndex",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "destinationAndNonce",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "checkpointedRoot",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "Dispatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "validatorManager",
        type: "address",
      },
    ],
    name: "NewValidatorManager",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_MESSAGE_BODY_BYTES",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "checkpoint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "checkpointedRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "checkpoints",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "count",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_destinationDomain",
        type: "uint32",
      },
      {
        internalType: "bytes32",
        name: "_recipientAddress",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_messageBody",
        type: "bytes",
      },
    ],
    name: "dispatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fail",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_validatorManager",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "latestCheckpoint",
    outputs: [
      {
        internalType: "bytes32",
        name: "root",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "localDomain",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "root",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_validatorManager",
        type: "address",
      },
    ],
    name: "setValidatorManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "state",
    outputs: [
      {
        internalType: "enum Home.States",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tree",
    outputs: [
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "validatorManager",
    outputs: [
      {
        internalType: "contract IValidatorManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b50604051611c7c380380611c7c8339818101604052602081101561003357600080fd5b505160e081901b6001600160e01b03191660805263ffffffff16611c13610069600039806105f75280610cb85250611c136000f3fe608060405234801561001057600080fd5b506004361061016c5760003560e01c8063c19d93fb116100cd578063f2fde38b11610081578063fd54b22811610066578063fd54b228146103ea578063fe55bde9146103f2578063ffa1ad74146103fa5761016c565b8063f2fde38b146102ff578063fa31de01146103325761016c565b8063c4d66de8116100b2578063c4d66de8146102a7578063eb5e91ff146102da578063ebf0c717146102f75761016c565b8063c19d93fb14610276578063c2c4c5c11461029f5761016c565b80638d3638f411610124578063907c0f9211610109578063907c0f921461022a578063a9cc47181461024b578063b95a2001146102535761016c565b80638d3638f4146101d85780638da5cb5b146101f95761016c565b806345f34e921161015557806345f34e9214610193578063522ae002146101c8578063715018a6146101d05761016c565b806306661abd146101715780631eb548de1461018b575b600080fd5b610179610418565b60408051918252519081900360200190f35b61017961041e565b6101c6600480360360208110156101a957600080fd5b503573ffffffffffffffffffffffffffffffffffffffff16610424565b005b6101796104d8565b6101c66104de565b6101e06105f5565b6040805163ffffffff9092168252519081900360200190f35b610201610619565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b610232610635565b6040805192835260208301919091528051918290030190f35b6101c661064b565b6101e06004803603602081101561026957600080fd5b503563ffffffff166106fe565b61027e610716565b6040518082600281111561028e57fe5b815260200191505060405180910390f35b6101c661071f565b6101c6600480360360208110156102bd57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff1661086a565b610179600480360360208110156102f057600080fd5b50356109b3565b6101796109c5565b6101c66004803603602081101561031557600080fd5b503573ffffffffffffffffffffffffffffffffffffffff166109d6565b6101c66004803603606081101561034857600080fd5b63ffffffff8235169160208101359181019060608101604082013564010000000081111561037557600080fd5b82018360208201111561038757600080fd5b803590602001918460018302840111640100000000831117156103a957600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610b78945050505050565b610179610dc1565b610201610dc7565b610402610de3565b6040805160ff9092168252519081900360200190f35b60205490565b60ec5481565b61042c610de8565b73ffffffffffffffffffffffffffffffffffffffff1661044a610619565b73ffffffffffffffffffffffffffffffffffffffff16146104cc57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6104d581610dec565b50565b61080081565b6104e6610de8565b73ffffffffffffffffffffffffffffffffffffffff16610504610619565b73ffffffffffffffffffffffffffffffffffffffff161461058657604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b60855460405160009173ffffffffffffffffffffffffffffffffffffffff16907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3608580547fffffffffffffffffffffffff0000000000000000000000000000000000000000169055565b7f000000000000000000000000000000000000000000000000000000000000000081565b60855473ffffffffffffffffffffffffffffffffffffffff1690565b60ec54600081815260ea60205260409020549091565b60b75473ffffffffffffffffffffffffffffffffffffffff1633146106d157604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f2176616c696461746f724d616e61676572000000000000000000000000000000604482015290519081900360640190fd5b60e980547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166002179055565b60eb6020526000908152604090205463ffffffff1681565b60e95460ff1681565b600260e95460ff16600281111561073257fe5b141561079f57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f6661696c65642073746174650000000000000000000000000000000000000000604482015290519081900360640190fd5b60006107a9610418565b90506000811161081a57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600660248201527f21636f756e740000000000000000000000000000000000000000000000000000604482015290519081900360640190fd5b60006108246109c5565b60ec819055600081815260ea602052604080822085905551919250839183917fb84fecc2f02e6bac34681511728ae2976bd7c0a0121ff91a9348515759ed237f91a35050565b605254610100900460ff16806108835750610883610ed9565b80610891575060525460ff16155b6108e6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180611bb0602e913960400191505060405180910390fd5b605254610100900460ff1615801561094c57605280547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff909116610100171660011790555b61095582610eea565b60e980547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016600117905580156109af57605280547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff1690555b5050565b60ea6020526000908152604090205481565b60006109d1600061100f565b905090565b6109de610de8565b73ffffffffffffffffffffffffffffffffffffffff166109fc610619565b73ffffffffffffffffffffffffffffffffffffffff1614610a7e57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b73ffffffffffffffffffffffffffffffffffffffff8116610aea576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526026815260200180611b8a6026913960400191505060405180910390fd5b60855460405173ffffffffffffffffffffffffffffffffffffffff8084169216907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3608580547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b600260e95460ff166002811115610b8b57fe5b1415610bf857604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f6661696c65642073746174650000000000000000000000000000000000000000604482015290519081900360640190fd5b61080081511115610c6a57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f6d736720746f6f206c6f6e670000000000000000000000000000000000000000604482015290519081900360640190fd5b63ffffffff808416600090815260eb602052604081208054808416600181019094167fffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000909116179055610ce17f00000000000000000000000000000000000000000000000000000000000000003384888888611028565b80516020820120909150610cf66000826110fe565b610d008684611206565b67ffffffffffffffff166001610d14610418565b03827f9d4c83d2e57d7d381feb264b44a5015e7f9ef26340f4fc46b558a6dc16dd811a60ec54866040518083815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610d7e578181015183820152602001610d66565b50505050905090810190601f168015610dab5780820380516001836020036101000a031916815260200191505b50935050505060405180910390a4505050505050565b60205481565b60b75473ffffffffffffffffffffffffffffffffffffffff1681565b600081565b3390565b610df581611220565b610e6057604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f21636f6e74726163742076616c696461746f724d616e61676572000000000000604482015290519081900360640190fd5b60b7805473ffffffffffffffffffffffffffffffffffffffff83167fffffffffffffffffffffffff0000000000000000000000000000000000000000909116811790915560408051918252517fe547ee4554b71678a728a4a8cd9e4a3570dfd31d3acbd0cc7397928fbbed66ff9181900360200190a150565b6000610ee430611220565b15905090565b605254610100900460ff1680610f035750610f03610ed9565b80610f11575060525460ff16155b610f66576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180611bb0602e913960400191505060405180910390fd5b605254610100900460ff16158015610fcc57605280547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff909116610100171660011790555b610fd4611226565b610fdd82610dec565b80156109af57605280547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff1690555050565b60006110228261101d611349565b61180a565b92915050565b6060868686868686604051602001808763ffffffff1660e01b81526004018681526020018563ffffffff1660e01b81526004018463ffffffff1660e01b815260040183815260200182805190602001908083835b602083106110b957805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0909201916020918201910161107c565b6001836020036101000a038019825116818451168082178552505050505050905001965050505050505060405160208183030381529060405290509695505050505050565b602082015463ffffffff1161117457604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f6d65726b6c6520747265652066756c6c00000000000000000000000000000000604482015290519081900360640190fd5b6020820180546001019081905560005b60208110156112035781600116600114156111b057828482602081106111a657fe5b0155506109af9050565b8381602081106111bc57fe5b0154836040516020018083815260200182815260200192505050604051602081830303815290604052805190602001209250600282816111f857fe5b049150600101611184565b50fe5b63ffffffff1660209190911b67ffffffff00000000161790565b3b151590565b605254610100900460ff168061123f575061123f610ed9565b8061124d575060525460ff16155b6112a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180611bb0602e913960400191505060405180910390fd5b605254610100900460ff1615801561130857605280547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff909116610100171660011790555b6113106118c8565b6113186119da565b80156104d557605280547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff16905550565b611351611b6a565b600081527fad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb560208201527fb4c11951957c6f8f642c4af61cd6b24640fec6dc7fc607ee8206a99e92410d3060408201527f21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba8560608201527fe58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a1934460808201527f0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d60a08201527f887c22bd8750d34016ac3c66b5ff102dacdd73f6b014e710b51e8022af9a196860c08201527fffd70157e48063fc33c97a050f7f640233bf646cc98d9524c6b92bcf3ab56f8360e08201527f9867cc5f7f196b93bae1e27e6320742445d290f2263827498b54fec539f756af6101008201527fcefad4e508c098b9a7e1d8feb19955fb02ba9675585078710969d3440f5054e06101208201527ff9dc3e7fe016e050eff260334f18a5d4fe391d82092319f5964f2e2eb7c1c3a56101408201527ff8b13a49e282f609c317a833fb8d976d11517c571d1221a265d25af778ecf8926101608201527f3490c6ceeb450aecdc82e28293031d10c7d73bf85e57bf041a97360aa2c5d99c6101808201527fc1df82d9c4b87413eae2ef048f94b4d3554cea73d92b0f7af96e0271c691e2bb6101a08201527f5c67add7c6caf302256adedf7ab114da0acfe870d449a3a489f781d659e8becc6101c08201527fda7bce9f4e8618b6bd2f4132ce798cdc7a60e7e1460a7299e3c6342a579626d26101e08201527f2733e50f526ec2fa19a22b31e8ed50f23cd1fdf94c9154ed3a7609a2f1ff981f6102008201527fe1d3b5c807b281e4683cc6d6315cf95b9ade8641defcb32372f1c126e398ef7a6102208201527f5a2dce0a8a7f68bb74560f8f71837c2c2ebbcbf7fffb42ae1896f13f7c7479a06102408201527fb46a28b6f55540f89444f63de0378e3d121be09e06cc9ded1c20e65876d36aa06102608201527fc65e9645644786b620e2dd2ad648ddfcbf4a7e5b1a3a4ecfe7f64667a3f0b7e26102808201527ff4418588ed35a2458cffeb39b93d26f18d2ab13bdce6aee58e7b99359ec2dfd96102a08201527f5a9c16dc00d6ef18b7933a6f8dc65ccb55667138776f7dea101070dc8796e3776102c08201527f4df84f40ae0c8229d0d6069e5c8f39a7c299677a09d367fc7b05e3bc380ee6526102e08201527fcdc72595f74c7b1043d0e1ffbab734648c838dfb0527d971b602bc216c9619ef6103008201527f0abf5ac974a1ed57f4050aa510dd9c74f508277b39d7973bb2dfccc5eeb0618d6103208201527fb8cd74046ff337f0a7bf2c8e03e10f642c1886798d71806ab1e888d9e5ee87d06103408201527f838c5655cb21c6cb83313b5a631175dff4963772cce9108188b34ac87c81c41e6103608201527f662ee4dd2dd7b2bc707961b1e646c4047669dcb6584f0d8d770daf5d7e7deb2e6103808201527f388ab20e2573d171a88108e79d820e98f26c0b84aa8b2f4aa4968dbb818ea3226103a08201527f93237c50ba75ee485f4c22adf2f741400bdf8d6a9cc7df7ecae576221665d7356103c08201527f8448818bb4ae4562849e949e17ac16e0be16688e156b5cf15e098c627c0056a96103e082015290565b6020820154600090815b60208110156118c057600182821c16600086836020811061183157fe5b01549050816001141561187457808560405160200180838152602001828152602001925050506040516020818303038152906040528051906020012094506118b6565b8486846020811061188157fe5b602002015160405160200180838152602001828152602001925050506040516020818303038152906040528051906020012094505b5050600101611814565b505092915050565b605254610100900460ff16806118e157506118e1610ed9565b806118ef575060525460ff16155b611944576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180611bb0602e913960400191505060405180910390fd5b605254610100900460ff1615801561131857605280547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff9091166101001716600117905580156104d557605280547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff16905550565b605254610100900460ff16806119f357506119f3610ed9565b80611a01575060525460ff16155b611a56576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602e815260200180611bb0602e913960400191505060405180910390fd5b605254610100900460ff16158015611abc57605280547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff909116610100171660011790555b6000611ac6610de8565b608580547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff8316908117909155604051919250906000907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a35080156104d557605280547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff16905550565b604051806104000160405280602090602082028036833750919291505056fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373496e697469616c697a61626c653a20636f6e747261637420697320616c726561647920696e697469616c697a6564a26469706673582212206e142a60cf2f15a547cb568423c86ac199f645f0d4de2ee90bf4e6093f32923764736f6c63430007060033";

export class Home__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _localDomain: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Home> {
    return super.deploy(_localDomain, overrides || {}) as Promise<Home>;
  }
  getDeployTransaction(
    _localDomain: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_localDomain, overrides || {});
  }
  attach(address: string): Home {
    return super.attach(address) as Home;
  }
  connect(signer: Signer): Home__factory {
    return super.connect(signer) as Home__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): HomeInterface {
    return new utils.Interface(_abi) as HomeInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Home {
    return new Contract(address, _abi, signerOrProvider) as Home;
  }
}
