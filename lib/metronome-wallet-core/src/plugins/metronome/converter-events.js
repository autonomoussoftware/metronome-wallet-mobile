'use strict'

const EventEmitter = require('events')
const MetronomeContracts = require('metronome-contracts')

function getPastEvents (web3, chain, address, fromBlock, toBlock) {
  const { autonomousConverter } = new MetronomeContracts(web3, chain)

  return Promise.all([
    // Convert ETH to MET
    autonomousConverter.getPastEvents('ConvertEthToMet', {
      fromBlock,
      toBlock,
      filter: { address }
    }),
    // Convert MET to ETH
    autonomousConverter.getPastEvents('ConvertMetToEth', {
      fromBlock,
      toBlock,
      filter: { address }
    })
  ])
    .then(([ethToMet, metToEth]) => [].concat(ethToMet, metToEth))
}

function createEventsStream (web3, chain, address) {
  const emitter = new EventEmitter()

  const { autonomousConverter } = new MetronomeContracts(web3, chain)

  // Convert ETH to MET
  autonomousConverter.events.ConvertEthToMet({ filter: { address } })
    .on('data', function (data) { emitter.emit('data', data) })
    .on('changed', function (data) { emitter.emit('changed', data) })
    .on('error', function (err) { emitter.emit('error', err) })
  // Convert MET to ETH
  autonomousConverter.events.ConvertMetToEth({ filter: { address } })
    .on('data', function (data) { emitter.emit('data', data) })
    .on('changed', function (data) { emitter.emit('changed', data) })
    .on('error', function (err) { emitter.emit('error', err) })

  return emitter
}

module.exports = {
  getPastEvents,
  createEventsStream
}
