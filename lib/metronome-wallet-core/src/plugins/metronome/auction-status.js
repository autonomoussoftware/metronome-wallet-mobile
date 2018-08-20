'use strict'

const MetronomeContracts = require('metronome-contracts')

function getAuctionStatus (web3, chain) {
  const { auctions } = new MetronomeContracts(web3, chain)

  return auctions.methods.heartbeat().call()
    .then(({
      currAuction,
      currentAuctionPrice,
      genesisGMT,
      minting,
      nextAuctionGMT
    }) => ({
      currentAuction: Number.parseInt(currAuction),
      currentPrice: currentAuctionPrice,
      genesisTime: Number.parseInt(genesisGMT, 10),
      nextAuctionStartTime: Number.parseInt(nextAuctionGMT, 10),
      tokenRemaining: minting
    }))
}

module.exports = getAuctionStatus
