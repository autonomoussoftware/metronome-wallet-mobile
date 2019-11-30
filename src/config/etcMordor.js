import MetronomeContracts from 'metronome-contracts'
import Config from 'react-native-config'

const contracts = MetronomeContracts['mordor']

const indexerUrl = Config.MORDOR_INDEXER_URL || 'http://localhost:3015'
const wsApiUrl = Config.MORDOR_NODE_URL || 'ws://localhost:8556'

export default {
  displayName: 'Mordor',
  chainType: 'ethereum',
  blockTime: 15,
  decimals: 18,
  chainId: 63,
  symbol: 'ETC',

  // connections status mappings
  connections: {
    indexer: 'Indexer connection',
    web3: 'Web3 connection'
  },

  // contracts addresses
  tokenPorterAddress: contracts.TokenPorter.address,
  converterAddress: contracts.AutonomousConverter.address,
  validatorAddress: contracts.Validator.address,
  metTokenAddress: contracts.METToken.address,
  auctionAddress: contracts.Auctions.address,

  // urls
  explorerUrl: 'https://mordorexplorer.ethernode.io/tx/{{hash}}',
  indexerUrl,
  wsApiUrl,

  // defaults
  coinDefaultGasLimit: '21000',
  metDefaultGasLimit: '250000',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
}
