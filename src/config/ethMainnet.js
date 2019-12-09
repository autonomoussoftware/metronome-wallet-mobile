import MetronomeContracts from 'metronome-contracts'

const contracts = MetronomeContracts['mainnet']

export default {
  displayName: 'Ethereum',
  chainType: 'ethereum',
  blockTime: 15,
  decimals: 18,
  chainId: 1,
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
  explorerUrl: 'https://etherscan.io/tx/{{hash}}',
  indexerUrl: 'https://indexer.metronome.io',
  wsApiUrl: 'wss://eth.wallet.metronome.io:8546',

  // defaults
  coinDefaultGasLimit: '21000',
  metDefaultGasLimit: '250000',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
}
