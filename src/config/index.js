import ethRopstenLocal from './ethRopstenLocal'
import etcMordenLocal from './etcMordenLocal'
import ethMainnet from './ethMainnet'

const enabledChains = (process.env.ENABLED_CHAINS || 'ethRopstenLocal')
  .split(',')
  .map(name => name.trim())

export default {
  chains: {
    ethRopstenLocal,
    etcMordenLocal,
    ethMainnet
  },
  dbAutocompactionInterval: 30000,
  debug: process.env.DEBUG || false,
  enabledChains,
  explorerDebounce: 2000,
  ratesUpdateMs: 30000,
  requiredPasswordEntropy: parseInt(
    process.env.REQUIRED_PASSWORD_ENTROPY || 72,
    10
  ),
  scanTransactionTimeout: 240000,
  sentryDsn: process.env.SENTRY_DSN,
  statePersistanceDebounce: 2000,
  trackingId: process.env.TRACKING_ID
}
