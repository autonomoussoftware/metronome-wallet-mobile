import RN from 'react-native'
import RNRestart from 'react-native-restart'
import config from '../config'

export function copyToClipboard(text) {
  return Promise.resolve(RN.Clipboard.setString(text))
}

export function onExplorerLinkClick(transactionHash) {
  const explorerURL = `${config.MTN_EXPLORER_URL}/transactions/${transactionHash}`
  return Promise.resolve(RN.Linking.openURL(explorerURL))
}

export function onTermsLinkClick() {
  const termsURL = 'https://github.com/autonomoussoftware/metronome-wallet-mobile/blob/develop/LICENSE'
  return Promise.resolve(RN.Linking.openURL(termsURL))
}

export function clearCache() {
  const keys = [
    'auction',
    'blockchain',
    'config',
    'connectivity',
    'converter',
    'rates',
    'session',
    'sync',
    'wallets'
  ]
  Promise.all([RN.AsyncStorage.multiRemove(keys)])
    .then(RNRestart.Restart())
}