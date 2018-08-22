'use strict'

const MetronomeContracts = require('metronome-contracts')
const { toBN } = require('web3-utils')

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
  return autonomousConverter.methods.convertEthToMet(minReturn)
    .send({ from, gas, gasPrice, value })
}

function convertMet (web3, chain, privateKey, transactionObject) {
  const { gasPrice, gas, value, from, minReturn = 1 } = transactionObject

  const account = web3.eth.accounts.privateKeyToAccount(privateKey)
  web3.eth.accounts.wallet.create(0).add(account)

  const { autonomousConverter, metToken } = new MetronomeContracts(web3, chain)
  const autonomousConverterAddress = autonomousConverter.options.address

  return metToken.methods.allowance(from, autonomousConverterAddress).call()
    .then(function (remaining) {
      if (toBN(remaining).lt(toBN(value))) {
        return metToken.methods.approve(autonomousConverterAddress, 0)
          .send({ from, gasPrice, gas })
          .then(() =>
            metToken.methods.approve(autonomousConverterAddress, value)
              .send({ from, gasPrice, gas })
          )
      }
      return true
    })
    .then(() =>
      autonomousConverter.methods.convertMetToEth(value, minReturn)
        .send({ from, gasPrice, gas })
    )
}

module.exports = {
  convertEth,
  convertMet,
  estimateEthToMetGas,
  estimateMetToEthGas,
  getEthToMetEstimate,
  getMetToMetEstimate
}
