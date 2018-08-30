import RN from 'react-native'

export function copyToClipboard(text) {
  return Promise.resolve(RN.Clipboard.setString(text))
}
