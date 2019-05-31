const MINIMAL_POWER = 5; // 5 Ethereum
const HEAD_NODE = 0 // Le noeud maitre => 0 pour la prémière fois


web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
abi = JSON.parse(
  '[{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes32"}],"name":"bytes32ToString","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"type":"constructor"}]'
);
VotingContract = web3.eth.contract(abi);
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = VotingContract.at(
  '0xc3d5fc3af03a134a91c9587a3f662969322e0138'
);
candidates = {
  Rama: 'candidate-1',
  Nick: 'candidate-2',
  Jose: 'candidate-3',
  Navin: 'candidate-4',
  Mike: 'candidate-5',
  Pamela: 'candidate-6',
  Thierry: 'candidate-7',
  Susanne: 'candidate-8',
  Matilda: 'candidate-9',
  Angelique: 'candidate-10',
  Marcelle: 'candidate-11'
};

function voteForCandidate() {
  // Disable voting button
  $('#btn-voter').attr('disabled', 'true');
  candidateName = $('#candidate').val();
  isValid = contractInstance.validCandidate.call(candidateName);
  if (isValid) {
    contractInstance.voteForCandidate(
      candidateName,
      { from: web3.eth.accounts[0] },
      function() {
        let div_id = candidates[candidateName];
        $('#' + div_id).html(
          contractInstance.totalVotesFor.call(candidateName).toString()
        );
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'success',
          title: `${candidateName} a reçu le vote avec succé`
        });
      }
    );
  } else {
    Swal.fire({
      type: 'error',
      title: 'Erreur...',
      text: `${candidateName} n'est pas un candidat valide!`,
      confirmButtonText: '<i class="far fa-window-close"></i> Fermer'
    });
  }
  // Re-enable voting button
  $('#btn-voter').removeAttr('disabled');
}

$(document).ready(function() {
    // La balance du premier compte
    web3.eth.getBalance(web3.eth.accounts[0], function (error, wei) {
        if (!error) {
            var balance = web3.fromWei(wei, 'ether').toString();
            console.log(balance < MINIMAL_POWER);
            console.log(balance - MINIMAL_POWER)
        }
    });
    candidateNames = Object.keys(candidates);
    for (var i = 0; i < candidateNames.length; i++) {
        let name = candidateNames[i];
        let val = contractInstance.totalVotesFor.call(name).toString();
        $('#' + candidates[name]).html(val);
    }
});
