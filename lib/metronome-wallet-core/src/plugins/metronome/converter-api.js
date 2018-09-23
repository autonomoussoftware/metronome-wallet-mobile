'use strict'

const MetronomeContracts = require('metronome-contracts')
const { utils: { toBN } } = require('web3')

const ESTIMATION_FACTOR = 1.1

function estimateEthToMetGas (web3, chain, { from, value, minReturn = '1' }) {
  const { autonomousConverter } = new MetronomeContracts(web3, chain)
  return autonomousConverter.methods.convertEthToMet(minReturn)
    .estimateGas({ from, value })
    .then(gasLimit => ({ gasLimit: Math.round(gasLimit * ESTIMATION_FACTOR) }))
}

function estimateMetToEthGas (web3, chain, { from, value, minReturn = '1' }) {
  const { autonomousConverter } = new MetronomeContracts(web3, chain)
  return autonomousConverter.methods.convertMetToEth(value, minReturn)
    .estimateGas({ from })
    .then(gasLimit => ({ gasLimit: Math.round(gasLimit * ESTIMATION_FACTOR) }))
}

function getEthToMetEstimate (web3, chain, { value }) {
  const { autonomousConverter } = new MetronomeContracts(web3, chain)
  return autonomousConverter.methods.getMetForEthResult(value).call()
    .then(result => ({ result }))
}

function getMetToMetEstimate (web3, chain, { value }) {
  const { autonomousConverter } = new MetronomeContracts(web3, chain)
  return autonomousConverter.methods.getEthForMetResult(value).call()
    .then(result => ({ result }))
}

function convertEth (web3, chain, privateKey, transactionObject) {
  const { gasPrice, gas, value, from, minReturn = 1 } = transactionObject

  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  web3.eth.accounts.wallet.create(0).add(account)

  const { autonomousConverter } = new MetronomeContracts(web3, chain)
  return web3.eth.getTransactionCount(from, 'pending')
    .then(nonce => autonomousConverter.methods.convertEthToMet(minReturn)
      .send({ from, gas, gasPrice, value, nonce })
    )
}

function convertMet (web3, chain, privateKey, transactionObject) {
  const { gasPrice, gas, value, from, minReturn = 1 } = transactionObject

  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  web3.eth.accounts.wallet.create(0).add(account)

  const { autonomousConverter, metToken } = new MetronomeContracts(web3, chain)
  const autonomousConverterAddress = autonomousConverter.options.address

  return Promise.all([
    metToken.methods.allowance(from, autonomousConverterAddress).call(),
    web3.eth.getTransactionCount(from, 'pending')
  ])
    .then(function ([remaining, nonce]) {
      if (toBN(remaining).gtn(0) && toBN(remaining).lt(toBN(value))) {
        return Promise.all([
          metToken.methods.approve(autonomousConverterAddress, 0)
            .send({ from, gasPrice, gas, nonce }),
          metToken.methods.approve(autonomousConverterAddress, value)
            .send({ from, gasPrice, gas, nonce: nonce + 1 }),
          autonomousConverter.methods.convertMetToEth(value, minReturn)
            .send({ from, gasPrice, gas, nonce: nonce + 2 })
        ])
          .then(([_, __, res]) => res) // eslint-disable-line no-unused-vars
      }
      if (toBN(remaining).eqn(0)) {
        return Promise.all([
          metToken.methods.approve(autonomousConverterAddress, value)
            .send({ from, gasPrice, gas, nonce }),
          autonomousConverter.methods.convertMetToEth(value, minReturn)
            .send({ from, gasPrice, gas, nonce: nonce + 1 })
        ])
          .then(([_, res]) => res) // eslint-disable-line no-unused-vars
      }
      return autonomousConverter.methods.convertMetToEth(value, minReturn)
        .send({ from, gasPrice, gas, nonce })
    })
}

module.exports = {
  convertEth,
  convertMet,
  estimateEthToMetGas,
  estimateMetToEthGas,
  getEthToMetEstimate,
  getMetToMetEstimate
}
