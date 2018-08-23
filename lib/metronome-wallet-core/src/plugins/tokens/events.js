'use strict'

const EventEmitter = require('events')

const abi = require('./erc20-abi.json')

function getPastEvents (web3, contractAddress, address, fromBlock, toBlock) {
  const contract = new web3.eth.Contract(abi, contractAddress)

  return Promise.all([
    // Transfer outgoing
    contract.getPastEvents('Transfer', {
      fromBlock,
      toBlock,
      filter: { _from: address }
    }),
    // Transfer incoming
    contract.getPastEvents('Transfer', {
      fromBlock,
      toBlock,
      filter: { _to: address }
    }),
    // Approval
    contract.getPastEvents('Approval', {
      fromBlock,
      toBlock,
      filter: { _owner: address }
    })
  ])
    .then(([outs, ins, approvals]) => [].concat(outs, ins, approvals))
}

function createEventsStream (web3, contractAddress, address) {
  const emitter = new EventEmitter()

  const contract = new web3.eth.Contract(abi, contractAddress)

  // Transfer outgoing
  contract.events.Transfer({ filter: { _from: address } })
    .on('data', function (data) { emitter.emit('data', data) })
    .on('changed', function (data) { emitter.emit('changed', data) })
    .on('error', function (err) { emitter.emit('error', err) })
  // Transfer incoming
  contract.events.Transfer({ filter: { _to: address } })
    .on('data', function (data) { emitter.emit('data', data) })
    .on('changed', function (data) { emitter.emit('changed', data) })
    .on('error', function (err) { emitter.emit('error', err) })
  // Approval
  contract.events.Approval({ filter: { _owner: address } })
    .on('data', function (data) { emitter.emit('data', data) })
    .on('changed', function (data) { emitter.emit('changed', data) })
    .on('error', function (err) { emitter.emit('error', err) })

  return emitter
}

module.exports = {
  getPastEvents,
  createEventsStream
}
