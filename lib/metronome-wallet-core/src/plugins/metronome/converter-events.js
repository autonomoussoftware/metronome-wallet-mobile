'use strict'

const MetronomeContracts = require('metronome-contracts')
const converterAbi = require('metronome-contracts/src/abis/AutonomousConverter')

function converterMetaParser () {
  return {
    metronome: {
      converter: true
    }
  }
}

const getEventDataCreator = chain => [
  address => ({
    contractAddress: MetronomeContracts.addresses[chain].autonomousConverter,
    abi: converterAbi,
    eventName: 'ConvertEthToMet',
    filter: { address },
    metaParser: converterMetaParser
  }),
  address => ({
    contractAddress: MetronomeContracts.addresses[chain].autonomousConverter,
    abi: converterAbi,
    eventName: 'ConvertMetToEth',
    filter: { address },
    metaParser: converterMetaParser
  })
]

module.exports = getEventDataCreator
