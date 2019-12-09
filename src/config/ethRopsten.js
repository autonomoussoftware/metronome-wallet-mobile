import MetronomeContracts from 'metronome-contracts'
import Config from 'react-native-config'

const contracts = MetronomeContracts['ropsten']

const indexerUrl = Config.ROPSTEN_INDEXER_URL || 'http://localhost:3005'
const wsApiUrl = Config.ROPSTEN_NODE_URL || 'ws://localhost:8546'

export default {
  displayName: 'Ropsten',
  chainType: 'ethereum',
  blockTime: 15,
  decimals: 18,
  chainId: 3,
  symbol: 'ETH',

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
  explorerUrl: 'https://ropsten.etherscan.io/tx/{{hash}}',
  indexerUrl,
  wsApiUrl,

  // defaults
  coinDefaultGasLimit: '21000',
  metDefaultGasLimit: '250000',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
}
