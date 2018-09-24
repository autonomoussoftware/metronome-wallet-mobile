'use strict'

const { eq } = require('lodash/fp')

const chainNames = [null, 'mainnet', null, 'ropsten']

const ethChainIdToName = id => chainNames[id]

const checkChainId = (web3, chain) =>
  web3.eth.net.getId()
    .then(ethChainIdToName)
    .then(eq(chain))

module.exports = {
  checkChainId
}
