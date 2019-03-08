import fastPasswordEntropy from 'fast-password-entropy'
import {
  getInternetCredentials,
  setInternetCredentials
} from 'react-native-keychain'
import { sha256 } from './crypto'

export const getStringEntropy = str => fastPasswordEntropy(str)

export const getHashedPIN = () =>
  getInternetCredentials('wallet.pin').then(credentials => credentials.password)

export const setPIN = pin =>
  setInternetCredentials('wallet.pin', 'pin', sha256(pin))

export const validatePIN = pin =>
  getHashedPIN().then(
    storagePin =>
      storagePin === sha256(pin) || Promise.reject(new Error('Wrong PIN'))
  )
