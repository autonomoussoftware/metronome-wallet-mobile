'use strict'

const MetronomeContracts = require('metronome-contracts')

function getPastEvents (web3, chain, address, fromBlock, toBlock) {
  const { auctions } = new MetronomeContracts(web3, chain)

  return auctions.getPastEvents('LogAuctionFundsIn', {
    fromBlock,
    toBlock,
    filter: { sender: address }
  })
}

function createEventsStream (web3, chain, address) {
  const { auctions } = new MetronomeContracts(web3, chain)

  return auctions.events.LogAuctionsFundsIn({ filter: { ssender: address } })
}

module.exports = {
  getPastEvents,
  createEventsStream
}
