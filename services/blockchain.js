const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');

// Initialize web3
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
const code = fs.readFileSync('contracts/Banking.sol').toString();
const compiledCode = solc.compile(code);
const byteCode = {
  linkReferences: {},
  object:
    '608060405234801561001057600080fd5b5060405160208061018483398101806040528101908080519060200190929190505050806000819055505061013a8061004a6000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806312065fe01461005c5780635f1cb5e714610087578063f04991f0146100b4575b600080fd5b34801561006857600080fd5b506100716100e1565b6040518082815260200191505060405180910390f35b34801561009357600080fd5b506100b2600480360381019080803590602001909291905050506100ea565b005b3480156100c057600080fd5b506100df600480360381019080803590602001909291905050506100fc565b005b60008054905090565b80600080828254039250508190555050565b806000808282540192505081905550505600a165627a7a72305820fdfd1dfc4cc281c72a830cb67c53ab9ed1b310548b3b727ea8a0868391cae35e0029',
  opcodes:
    'PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x40 MLOAD PUSH1 0x20 DUP1 PUSH2 0x184 DUP4 CODECOPY DUP2 ADD DUP1 PUSH1 0x40 MSTORE DUP2 ADD SWAP1 DUP1 DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP DUP1 PUSH1 0x0 DUP2 SWAP1 SSTORE POP POP PUSH2 0x13A DUP1 PUSH2 0x4A PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN STOP PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x4 CALLDATASIZE LT PUSH2 0x57 JUMPI PUSH1 0x0 CALLDATALOAD PUSH29 0x100000000000000000000000000000000000000000000000000000000 SWAP1 DIV PUSH4 0xFFFFFFFF AND DUP1 PUSH4 0x12065FE0 EQ PUSH2 0x5C JUMPI DUP1 PUSH4 0x5F1CB5E7 EQ PUSH2 0x87 JUMPI DUP1 PUSH4 0xF04991F0 EQ PUSH2 0xB4 JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x68 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x71 PUSH2 0xE1 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x93 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xB2 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0xEA JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xC0 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xDF PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0xFC JUMP JUMPDEST STOP JUMPDEST PUSH1 0x0 DUP1 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST DUP1 PUSH1 0x0 DUP1 DUP3 DUP3 SLOAD SUB SWAP3 POP POP DUP2 SWAP1 SSTORE POP POP JUMP JUMPDEST DUP1 PUSH1 0x0 DUP1 DUP3 DUP3 SLOAD ADD SWAP3 POP POP DUP2 SWAP1 SSTORE POP POP JUMP STOP LOG1 PUSH6 0x627A7A723058 KECCAK256 REVERT REVERT SAR 0xfc 0x4c 0xc2 DUP2 0xc7 0x2a DUP4 0xc 0xb6 PUSH29 0x53AB9ED1B310548B3B727EA8A0868391CAE35E00290000000000000000 ',
  sourceMap:
    '26:361:0:-;;;71:64;8:9:-1;5:2;;;30:1;27;20:12;5:2;71:64:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;122:6;112:7;:16;;;;71:64;26:361;;;;;;'
};
const abiDefinition = [
  {
    constant: true,
    inputs: [],
    name: 'getBalance',
    outputs: [
      {
        name: '',
        type: 'int256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'amount',
        type: 'int256'
      }
    ],
    name: 'withdrawal',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'amount',
        type: 'int256'
      }
    ],
    name: 'deposit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        name: 'amount',
        type: 'int256'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  }
];

/*
 * Retrieve contract from its address
 */
let bankingContract = web3.eth.contract(abiDefinition);
// The contract address must be changed for each deployment
contractInstance = bankingContract.at(
  '0xebc64dd901510a8e9a523e3c46b5c87eb10071c2'
);

/*
 * Deploy the contract for the first using => Use node console instead
 */
// var amount = 85000;
// var bankingContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"int256"}],"name":"withdrawal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"int256"}],"name":"deposit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"amount","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);
// var contractInstance = bankingContract.new(
//    amount,
//    {
//      from: web3.eth.accounts[0],
//      data: '0x608060405234801561001057600080fd5b5060405160208061018483398101806040528101908080519060200190929190505050806000819055505061013a8061004a6000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806312065fe01461005c5780635f1cb5e714610087578063f04991f0146100b4575b600080fd5b34801561006857600080fd5b506100716100e1565b6040518082815260200191505060405180910390f35b34801561009357600080fd5b506100b2600480360381019080803590602001909291905050506100ea565b005b3480156100c057600080fd5b506100df600480360381019080803590602001909291905050506100fc565b005b60008054905090565b80600080828254039250508190555050565b806000808282540192505081905550505600a165627a7a72305820fdfd1dfc4cc281c72a830cb67c53ab9ed1b310548b3b727ea8a0868391cae35e0029',
//      gas: '4700000'
//    }, (e, contract) => {
//     if (typeof contract.address !== 'undefined') {
//         return contract;
//     } else {
//         return null;
//     }
//  });

module.exports = { contractInstance: contractInstance, web3: web3 };
