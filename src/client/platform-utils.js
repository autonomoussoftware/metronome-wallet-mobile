import RN from 'react-native'

export function copyToClipboard(text) {
  return Promise.resolve(RN.Clipboard.setString(text))
}

export function onTermsLinkClick() {
  const termsURL = 'https://github.com/autonomoussoftware/metronome-wallet-mobile/blob/develop/LICENSE'
  return Promise.resolve(RN.Linking.openURL(termsURL))
}