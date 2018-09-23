'use strict'

const MetronomeContracts = require('metronome-contracts')

const ESTIMATION_FACTOR = 1.1

function buyMet (web3, chain, privateKey, transactionObject) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  web3.eth.accounts.wallet.create(0).add(account)

  const to = MetronomeContracts.addresses[chain].auctions
  return web3.eth.getTransactionCount(transactionObject.from, 'pending')
    .then(nonce =>
      web3.eth.sendTransaction(Object.assign(transactionObject, { nonce, to }))
    )
}

function estimateAuctionGas (web3, chain, { from, value }) {
  const to = MetronomeContracts.addresses[chain].auctions
  return web3.eth.estimateGas({ from, to, value })
    .then(gasLimit => ({ gasLimit: Math.round(gasLimit * ESTIMATION_FACTOR) }))
}

module.exports = {
  buyMet,
  estimateAuctionGas
}
