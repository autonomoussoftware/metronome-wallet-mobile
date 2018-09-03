import RN from 'react-native'
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
