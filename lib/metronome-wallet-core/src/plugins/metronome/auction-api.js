'use strict'

const MetronomeContracts = require('metronome-contracts')

const ESTIMATION_FACTOR = 1.1

function estimateAuctionGas (web3, chain, { from, value }) {
  const to = MetronomeContracts.addresses[chain].auctions
  return web3.eth.estimateGas({ from, to, value })
    .then(gasLimit => ({ gasLimit: Math.round(gasLimit * ESTIMATION_FACTOR) }))
}

module.exports = {
  estimateAuctionGas
}
