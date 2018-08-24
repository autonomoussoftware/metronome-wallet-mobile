'use strict'

const MetronomeContracts = require('metronome-contracts')
const auctionsAbi = require('metronome-contracts/src/abis/Auctions')

function auctionMetaParser ({ returnValues }) {
  return {
    metronome: {
      auction: true
    },
    returnedValue: returnValues.refund
  }
}

const getEventDataCreator = chain => address => ({
  contractAddress: MetronomeContracts.addresses[chain].auctions,
  abi: auctionsAbi,
  eventName: 'LogAuctionFundsIn',
  filter: { sender: address },
  metaParser: auctionMetaParser
})

module.exports = getEventDataCreator