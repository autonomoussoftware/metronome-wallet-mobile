import fastPasswordEntropy from 'fast-password-entropy'
import * as Keychain from 'react-native-keychain'
import { Settings } from 'react-native'
import { sha256 } from './crypto'

export const getStringEntropy = str => fastPasswordEntropy(str)

export const getHashedPIN = () =>
  Keychain.getInternetCredentials('wallet.pin').then(({ password }) =>
    password && Settings.get('useStoredCredentials') === 'true'
      ? password
      : false
  )

export const setPIN = pin =>
  Keychain.setInternetCredentials('wallet.pin', 'pin', sha256(pin)).then(() =>
    Settings.set({ useStoredCredentials: 'true' })
  )

export const validatePIN = pin =>
  getHashedPIN().then(
    storagePin =>
      storagePin === sha256(pin) || Promise.reject(new Error('Wrong PIN'))
  )
