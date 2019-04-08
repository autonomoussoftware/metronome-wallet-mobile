import RN from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import VersionNumber from 'react-native-version-number'
import RNRestart from 'react-native-restart'
import config from '../config'
import { validatePIN } from './auth'
import { setSeed } from './wallet'
import { mnemonicToSeedHex } from './keys'

export const copyToClipboard = text =>
  Promise.resolve(RN.Clipboard.setString(text))

const openURL = url => Promise.resolve(RN.Linking.openURL(url))

export const onLinkClick = url => openURL(url)

export const onTermsLinkClick = () =>
  openURL(
    'https://github.com/autonomoussoftware/metronome-wallet-mobile/blob/develop/LICENSE'
  )

export const onHelpLinkClick = () =>
  openURL(
    'https://github.com/autonomoussoftware/documentation/blob/master/FAQ.md#metronome-faq'
  )

export const clearCache = () => {
  const keys = ['chains', 'config', 'connectivity', 'session', 'sync']
  return AsyncStorage.multiRemove(keys).then(() => RNRestart.Restart())
}

export const recoverFromMnemonic = ({ mnemonic, password }) =>
  validatePIN(password)
    .then(() => setSeed(mnemonicToSeedHex(mnemonic)))
    .then(clearCache)

export const getSettingsVersion = () => AsyncStorage.getItem('settings-version')

export const shouldRestartSettings = () =>
  getSettingsVersion().then(
    settingsVersion =>
      config.settingsVersion > Number.parseInt(settingsVersion || 0)
  )

export const saveSettingsVersion = () =>
  AsyncStorage.setItem(
    'settings-version',
    JSON.stringify(config.settingsVersion || 0)
  )

export const getAppVersion = () => VersionNumber.appVersion
