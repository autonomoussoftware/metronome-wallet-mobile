'use strict'

const abi = require('./erc20-abi.json')

function transferMetaParser ({ address, event, returnValues }) {
  return {
    tokens: {
      [address]: {
        event,
        from: returnValues._from,
        to: returnValues._to,
        value: returnValues._value,
        processing: false
      }
    }
  }
}

function approvalMetaParser ({ address, event, returnValues }) {
  return {
    tokens: {
      [address]: {
        event,
        from: returnValues._owner,
        to: returnValues._spender,
        value: returnValues._value,
        processing: false
      }
    }
  }
}

const getEventDataCreators = contractAddress => [
  address => ({
    contractAddress,
    abi,
    eventName: 'Transfer',
    filter: { _from: address },
    metaParser: transferMetaParser
  }),
  address => ({
    contractAddress,
    abi,
    eventName: 'Transfer',
    filter: { _to: address },
    metaParser: transferMetaParser
  }),
  address => ({
    contractAddress,
    abi,
    eventName: 'Approval',
    filter: { _owner: address },
    metaParser: approvalMetaParser
  })
]

module.exports = getEventDataCreators
