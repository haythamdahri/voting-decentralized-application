const toAscii = hex => {
  var str = '';
  var i = 0,
    l = hex.length;
  if (hex.substring(0, 2) === '0x') {
    i = 2;
  }
  for (; i < l; i += 2) {
    var code = parseInt(hex.substr(i, 2), 16);
    if (code != 0) {
      str += String.fromCharCode(code);
    }
  }

  return str;
};

const candidateStatistics = async (votingContractInstance, candidate) => {
  // toAscii is personal function into order to retrieve candidate name
  let candidateName = toAscii(candidate);
  let votesCount = await votingContractInstance.totalVotesFor
    .call(candidateName)
    .toString();
  return {candidateName: candidateName, votesCount: votesCount};
};

module.exports = {
  toAscii: toAscii,
  candidateStatistics: candidateStatistics
};
