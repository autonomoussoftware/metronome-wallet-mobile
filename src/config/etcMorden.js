import MetronomeContracts from 'metronome-contracts'
import Config from 'react-native-config'

const contracts = MetronomeContracts['morden']

const indexerUrl = Config.MORDEN_INDEXER_URL || 'http://localhost:3015'
const metApiUrl = Config.MORDEN_API_URL || 'http://localhost:3012/'
const wsApiUrl = Config.MORDEN_NODE_URL || 'ws://localhost:8556'

export default {
  displayName: 'Morden',
  chainId: 62,
  symbol: 'ETC',

  // contracts addresses
  tokenPorterAddress: contracts.TokenPorter.address,
  converterAddress: contracts.AutonomousConverter.address,
  validatorAddress: contracts.Validator.address,
  metTokenAddress: contracts.METToken.address,
  auctionAddress: contracts.Auctions.address,

  // urls
  explorerUrl: 'https://mordenexplorer.ethernode.io/tx/{{hash}}',
  indexerUrl,
  metApiUrl,
  wsApiUrl,

  // defauls
  coinDefaultGasLimit: '21000',
  metDefaultGasLimit: '250000',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
}
