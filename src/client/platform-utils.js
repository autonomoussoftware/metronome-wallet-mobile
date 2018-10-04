import RN from 'react-native'
import RNRestart from 'react-native-restart'
import config from '../config'
import { validatePIN } from './auth'
import { setSeed } from './wallet'
import { mnemonicToSeedHex } from './keys'

export const copyToClipboard = text => Promise.resolve(RN.Clipboard.setString(text))

const openURL = URL => Promise.resolve(RN.Linking.openURL(URL))

export const onExplorerLinkClick = (transactionHash) =>
  openURL(`${config.MTN_EXPLORER_URL}/transactions/${transactionHash}`)

export const onTermsLinkClick = () =>
  openURL('https://github.com/autonomoussoftware/metronome-wallet-mobile/blob/develop/LICENSE')

export const onHelpLinkClick = () =>
  openURL('https://github.com/autonomoussoftware/documentation/blob/master/FAQ.md#metronome-faq')

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
  return Promise.all([RN.AsyncStorage.multiRemove(keys)])
    .then(RNRestart.Restart())
}

export const recoverFromMnemonic = ({ mnemonic, password }) =>
  validatePIN(password)
    .then(() => setSeed(mnemonicToSeedHex(mnemonic)))
    .then(clearCache)