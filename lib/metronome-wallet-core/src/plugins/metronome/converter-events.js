'use strict'

const MetronomeContracts = require('metronome-contracts')
const converterAbi = require('metronome-contracts/src/abis/AutonomousConverter')

function converterMetaParser ({ event, returnValues }) {
  return {
    metronome: {
      converter: true
    },
    returnedValue: event === 'ConvertMetToEth' ? returnValues.eth : '0'
  }
}

const getEventDataCreator = chain => [
  address => ({
    contractAddress: MetronomeContracts.addresses[chain].autonomousConverter,
    abi: converterAbi,
    eventName: 'ConvertEthToMet',
    filter: { from: address },
    metaParser: converterMetaParser
  }),
  address => ({
    contractAddress: MetronomeContracts.addresses[chain].autonomousConverter,
    abi: converterAbi,
    eventName: 'ConvertMetToEth',
    filter: { from: address },
    metaParser: converterMetaParser
  })
]

module.exports = getEventDataCreator
