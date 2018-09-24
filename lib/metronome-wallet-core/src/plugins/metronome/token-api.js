'use strict'

const MetronomeContracts = require('metronome-contracts')

function addAccount (web3, privateKey) {
  web3.eth.accounts.wallet.create(0)
    .add(web3.eth.accounts.privateKeyToAccount(privateKey))
}

function sendMet (web3, chain, logTransaction, metaParsers) {
  const { metToken } = new MetronomeContracts(web3, chain)
  return function (privateKey, { gasPrice, gas, from, to, value }) {
    addAccount(web3, privateKey)
    return web3.eth.getTransactionCount(from, 'pending')
      .then(nonce =>
        logTransaction(
          metToken.methods.transfer(to, value)
            .send({ from, gasPrice, gas, nonce }),
          from,
          metaParsers.transfer({
            address: metToken.options.address,
            returnValues: { _from: from, _to: to, _value: value }
          })
        )
      )
  }
}

module.exports = {
  sendMet
}
