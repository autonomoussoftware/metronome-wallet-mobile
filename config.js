/**
 * Default settings for production and development builds.
 * Development build variables could be set in `.config.dev.js`.
 */

let config = {
  REACT_APP_ETH_CHAIN: __DEV__ ? 'mainnet' : 'testnet',
  REACT_APP_MET_EXPLORER_URL: 'https://explorer.metronome.io',
  REACT_APP_WS_API_URL: __DEV__
    ? 'wss://eth.wallet.metronome.io:8546'
    : 'wss://localhost:8546',
  REACT_APP_SENTRY_DSN: ''
}

try {
  config = __DEV__ && { ...config, ...require('./.config.dev') }
} catch (err) {} // eslint-disable-line no-empty

module.exports = config