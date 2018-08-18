import Contracts from 'metronome-contracts'

export const readDotEnv = 4 // HACK: change this to force reading .env changes

// https://github.com/brysgo/babel-plugin-inline-dotenv/issues/1
const REACT_APP_ETH_CHAIN = process.env.REACT_APP_ETH_CHAIN
const REACT_APP_MET_EXPLORER_URL = process.env.REACT_APP_MET_EXPLORER_URL
const REACT_APP_SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN
const REACT_APP_WS_API_URL = process.env.REACT_APP_WS_API_URL

export default {
  MTN_TOKEN_ADDR: Contracts.addresses[REACT_APP_ETH_CHAIN].metToken,
  CONVERTER_ADDR: Contracts.addresses[REACT_APP_ETH_CHAIN].autonomousConverter,
  MTN_EXPLORER_URL: REACT_APP_MET_EXPLORER_URL,
  SENTRY_DSN: REACT_APP_SENTRY_DSN,
  ETH_DEFAULT_GAS_LIMIT: '21000',
  MET_DEFAULT_GAS_LIMIT: '200000',
  DEFAULT_GAS_PRICE: '1000000000',
  REQUIRED_PASSWORD_ENTROPY: 20,
  rates: {
    updateMs: 15000
  },
  eth: {
    chain: REACT_APP_ETH_CHAIN,
    wsApiUrl: REACT_APP_WS_API_URL
  },
  debug: true
}
