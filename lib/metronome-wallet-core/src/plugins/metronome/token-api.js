'use strict'

const MetronomeContracts = require('metronome-contracts')

function sendMet (web3, chain, privateKey, { gasPrice, gas, from, to, value }) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  web3.eth.accounts.wallet.create(0).add(account)

  const { metToken } = new MetronomeContracts(web3, chain)
  return metToken.methods.transfer(to, value).send({ from, gasPrice, gas })
}

module.exports = {
  sendMet
}
