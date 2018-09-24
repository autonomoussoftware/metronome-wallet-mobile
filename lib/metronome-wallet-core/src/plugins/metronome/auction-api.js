'use strict'

const MetronomeContracts = require('metronome-contracts')

const OVER_ESTIMATION = 1.1

function addAccount (web3, privateKey) {
  web3.eth.accounts.wallet.create(0)
    .add(web3.eth.accounts.privateKeyToAccount(privateKey))
}

function buyMet (web3, chain, logTransaction, metaParsers) {
  const to = MetronomeContracts.addresses[chain].auctions
  return function (privateKey, { from, value, gas, gasPrice }) {
    addAccount(web3, privateKey)
    return web3.eth.getTransactionCount(from, 'pending')
      .then(nonce =>
        logTransaction(
          web3.eth.sendTransaction({ from, to, value, gas, gasPrice, nonce }),
          from,
          metaParsers.auction({ returnValues: { refund: '0' } })
        )
      )
  }
}

function estimateAuctionGas (web3, chain) {
  const to = MetronomeContracts.addresses[chain].auctions
  return ({ from, value }) => web3.eth.estimateGas({ from, to, value })
    .then(gasLimit => ({ gasLimit: Math.round(gasLimit * OVER_ESTIMATION) }))
}

module.exports = {
  buyMet,
  estimateAuctionGas
}
