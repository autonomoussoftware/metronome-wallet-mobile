'use strict'

function ethChainIdToName (id) {
  const chainNames = [null, 'mainnet', null, 'ropsten']
  return chainNames[id]
}

module.exports = {
  ethChainIdToName
}
