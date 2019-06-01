## Usage

After all dependancies are installed, run `Ganache` software.

Run the following commands to open the node console then deploy your contract to the Blockchain

```
HAYTHAM:~/Voting contract deloyment
$ node
> Web3 = require('web3')
> web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
> code = fs.readFileSync('Voting.sol').toString()
> solc = require('solc')
> compiledCode = solc.compile(code)
> abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface)
> VotingContract = web3.eth.contract(abiDefinition)
> byteCode = compiledCode.contracts[':Voting'].bytecode
> deployedContract = VotingContract.new(['Rama','Nick','Jose', 'Navin', 'Mike', 'Pamela', 'Thierry', 'Susanne', 'Matilda', 'Angelique', 'Marcelle'], {data: byteCode, from: web3.eth.accounts[0], gas: 4700000})
> deployedContract.address
> contractInstance = VotingContract.at(deployedContract.address)
> contractInstance.voteForCandidate('Rama', {from: web3.eth.accounts[0]})
> contractInstance.markVoter('0sfd3ds5f13sd5f16s3d5fsdfwxwwxwx', {from: web3.eth.accounts[0]})
> contractInstance.totalVotesFor.call('Rama').toString()
```