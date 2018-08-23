import Contracts from 'metronome-contracts'
import Config from '../config'

export default {
  MTN_TOKEN_ADDR: Contracts.addresses[Config.REACT_APP_ETH_CHAIN].metToken,
  CONVERTER_ADDR: Contracts.addresses[Config.REACT_APP_ETH_CHAIN].autonomousConverter,
  MTN_EXPLORER_URL: Config.REACT_APP_MET_EXPLORER_URL,
  SENTRY_DSN: Config.REACT_APP_SENTRY_DSN,
  ETH_DEFAULT_GAS_LIMIT: '21000',
  MET_DEFAULT_GAS_LIMIT: '200000',
  DEFAULT_GAS_PRICE: '1000000000',
  REQUIRED_PASSWORD_ENTROPY: 20,
  rates: {
    updateMs: 15000
  },
  eth: {
    chain: Config.REACT_APP_ETH_CHAIN,
    wsApiUrl: Config.REACT_APP_WS_API_URL
  },
  debug: true
}
