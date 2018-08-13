import Contracts from 'metronome-contracts'

import {
  REACT_APP_CHAIN,
  REACT_APP_MET_EXPLORER_URL,
  REACT_APP_SENTRY_DSN
} from 'react-native-dotenv'

export default {
  MTN_TOKEN_ADDR: Contracts.addresses[REACT_APP_CHAIN].metToken,
  CONVERTER_ADDR: Contracts.addresses[REACT_APP_CHAIN].autonomousConverter,
  MTN_EXPLORER_URL: REACT_APP_MET_EXPLORER_URL,
  SENTRY_DSN: REACT_APP_SENTRY_DSN,
  ETH_DEFAULT_GAS_LIMIT: '21000',
  MET_DEFAULT_GAS_LIMIT: '200000',
  DEFAULT_GAS_PRICE: '1000000000',
  REQUIRED_PASSWORD_ENTROPY: 72,
  rates: {
    updateMs: 15000
  }
}
