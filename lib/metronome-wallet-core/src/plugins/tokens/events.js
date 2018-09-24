'use strict'

const abi = require('./erc20-abi.json')

const transferMetaParser = ({ address, returnValues }) => ({
  tokens: {
    [address]: {
      event: 'Transfer',
      from: returnValues._from,
      to: returnValues._to,
      value: returnValues._value,
      processing: false
    }
  }
})

const approvalMetaParser = ({ address, returnValues }) => ({
  tokens: {
    [address]: {
      event: 'Approval',
      from: returnValues._owner,
      to: returnValues._spender,
      value: returnValues._value,
      processing: false
    }
  }
})

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

module.exports = {
  getEventDataCreators,
  approvalMetaParser,
  transferMetaParser
}
