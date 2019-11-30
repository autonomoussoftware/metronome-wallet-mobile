import MetronomeContracts from 'metronome-wallet-core/contracts'
import { keyBy } from 'lodash'
import Config from 'react-native-config'

const chainId = 'test'
const chainType = 'qtum'

const contracts = keyBy(MetronomeContracts[chainType][chainId], 'name')

export default {
  displayName: 'Qtum Testnet',
  chainType,
  blockTime: 120,
  decimals: 8,
  chainId,
  symbol: 'QTUM',

  // connections status mappings
  connections: {
    explorer: 'Explorer connection'
  },

  // contracts addresses
  tokenPorterAddress: contracts['TokenPorter'].address,
  converterAddress: contracts['AutonomousConverter'].address,
  validatorAddress: contracts['Validator'].address,
  metTokenAddress: contracts['METToken'].address,
  auctionAddress: contracts['Auctions'].address,

  // urls
  explorerApiUrl: Config.QTUMTEST_EXPLORER_URL || 'http://localhost:3001',
  explorerUrl: `${Config.QTUMTEST_EXPLORER_URL ||
    'http://localhost:3001'}/tx/{{hash}}`,
  nodeUrl: Config.QTUMTEST_NODE_URL || 'http://user:password@localhost:13889',

  // defaults
  coinDefaultGasLimit: '21000',
  metDefaultGasLimit: '250000',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
}
