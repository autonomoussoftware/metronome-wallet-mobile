import Contracts from 'metronome-contracts'

const __TEST__ = true

const devEnv = {
  ETH_CHAIN: 'ropsten',
  ETH_WS_API_URL: 'ws://localhost:8546',
  EXPLORER_INDEXER_URL: 'http://localhost:3005',
  MET_EXPLORER_URL: 'http://localhost:3004',
  TRACKING_ID: 'UA-116275666-3',
  SENTRY_DSN: null,
  debug: true
}

const testEnv = {
  ETH_CHAIN: 'ropsten',
  ETH_WS_API_URL: 'wss://eth.wallet.bloqrock.net:8546',
  EXPLORER_INDEXER_URL: 'https://indexer.bloqrock.net',
  MET_EXPLORER_URL: 'https://explorer.met.bloqrock.net',
  TRACKING_ID: 'UA-116275666-3',
  SENTRY_DSN: null,
  debug: true
}

const prodEnv = {
  ETH_CHAIN: 'mainnet',
  ETH_WS_API_URL: 'wss://eth.wallet.metronome.io:8546',
  EXPLORER_INDEXER_URL: 'https://indexer.metronome.io',
  MET_EXPLORER_URL: 'https://explorer.metronome.io',
  TRACKING_ID: 'UA-116275666-6',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://4211b3b9085f4931837b8b7916bfa0a5@sentry.io/1279846',
  debug: false
}

const createConfig = env => ({
  MTN_TOKEN_ADDR: Contracts.addresses[env.ETH_CHAIN].metToken,
  CONVERTER_ADDR: Contracts.addresses[env.ETH_CHAIN].autonomousConverter,
  MTN_EXPLORER_URL: env.MET_EXPLORER_URL,
  SENTRY_DSN: env.SENTRY_DSN,
  ETH_DEFAULT_GAS_LIMIT: '21000',
  MET_DEFAULT_GAS_LIMIT: '200000',
  DEFAULT_GAS_PRICE: '1000000000',
  REQUIRED_PASSWORD_ENTROPY: 20,
  TRACKING_ID: env.TRACKING_ID,
  SETTINGS_VERSION: 1,
  eth: {
    chain: env.ETH_CHAIN,
    wsApiUrl: env.ETH_WS_API_URL
  },
  explorer: {
    indexerUrl: env.EXPLORER_INDEXER_URL
  },
  debug: env.debug
})

const config = createConfig(
  __TEST__
    ? testEnv
    : __DEV__
      ? devEnv
      : prodEnv
)

export default config
