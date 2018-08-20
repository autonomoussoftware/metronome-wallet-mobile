'use strict'

const MetronomeContracts = require('metronome-contracts')

const ESTIMATION_FACTOR = 1.1

function estimateEthToMetGas (web3, chain, { from, value, minReturn = '1' }) {
  const converter = new MetronomeContracts(web3, chain).autonomousConverter
  return converter.methods.convertEthToMet(minReturn)
    .estimateGas({ from, value })
    .then(gasLimit => ({ gasLimit: Math.round(gasLimit * ESTIMATION_FACTOR) }))
}

function estimateMetToEthGas (web3, chain, { from, value, minReturn = '1' }) {
  const converter = new MetronomeContracts(web3, chain).autonomousConverter
  return converter.methods.convertMetToEth(value, minReturn)
    .estimateGas({ from })
    .catch(() => 200000) // If allowance is not set, assume a safe gas limit
    .then(gasLimit => ({ gasLimit: Math.round(gasLimit * ESTIMATION_FACTOR) }))
}

function getEthToMetEstimate (web3, chain, { value }) {
  const converter = new MetronomeContracts(web3, chain).autonomousConverter
  return converter.methods.getMetForEthResult(value).call()
    .then(result => ({ result }))
}

function getMetToMetEstimate (web3, chain, { value }) {
  const converter = new MetronomeContracts(web3, chain).autonomousConverter
  return converter.methods.getEthForMetResult(value).call()
    .then(result => ({ result }))
}

module.exports = {
  estimateEthToMetGas,
  estimateMetToEthGas,
  getEthToMetEstimate,
  getMetToMetEstimate
}
