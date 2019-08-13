import ethRopsten from './ethRopsten'
import etcMorden from './etcMorden'
import ethMainnet from './ethMainnet'
import etcMainnet from './etcMainnet'
import { Alert } from 'react-native'
import Config from 'react-native-config'

const enabledChains = (Config.ENABLED_CHAINS || 'ethRopsten,etcMorden')
  .split(',')
  .map(name => name.trim())

const availableChains = {
  ethRopsten,
  etcMorden,
  ethMainnet,
  etcMainnet
}

const missingConfigurations = enabledChains.filter(
  name => !availableChains[name]
)

if (missingConfigurations.length > 0) {
  Alert.alert(
    'Missing configuration',
    `There are no configuration values for enabled chain(s) ${missingConfigurations
      .map(name => `"${name}"`)
      .join(', ')}. Check your ENABLED_CHAINS environment variable!`
  )
}

export default {
  chains: availableChains,
  dbAutocompactionInterval: 30000,
  debug: Config.RN_DEBUG || false,
  enabledChains,
  useNativeCookieJar: true,
  explorerDebounce: 2000,
  ratesUpdateMs: 30000,
  requiredPasswordEntropy: 20,
  scanTransactionTimeout: 240000,
  sentryDsn: Config.SENTRY_DSN,
  settingsVersion: 2,
  statePersistanceDebounce: 2000,
  trackingId: Config.TRACKING_ID || '',
  web3Timeout: 120000
}
