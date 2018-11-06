import * as Keychain from 'react-native-keychain'
import { sha256 } from './crypto'

export const getHashedPIN = () =>
  Keychain.getInternetCredentials('wallet.pin')
    .then(credentials => credentials.password)

export const setPIN = pin =>
  Keychain.setInternetCredentials('wallet.pin', 'pin', sha256(pin))

export const validatePIN = pin =>
  getHashedPIN()
    .then(storagePin => storagePin === sha256(pin) || Promise.reject(new Error('Wrong PIN')))

export const onLoginSubmit = ({ password }) => validatePIN(password)
