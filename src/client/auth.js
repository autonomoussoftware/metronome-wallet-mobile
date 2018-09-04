import { AsyncStorage } from 'react-native'
import { sha256 } from './crypto'
import fastPasswordEntropy from 'fast-password-entropy'

// TODO no longer needed once password is replaced
export const getStringEntropy = str =>
  fastPasswordEntropy(str)

export const getHashedPIN = () =>
  AsyncStorage.getItem('wallet.pin')

export const setPIN = pin =>
  AsyncStorage.setItem('wallet.pin', sha256(pin))

export const validatePIN = pin =>
  AsyncStorage.getItem('wallet.pin')
    .then(storagePin => storagePin === sha256(pin) || Promise.reject({ message: 'Wrong PIN'}))

export function onLoginSubmit({ password }) {
  return validatePIN(password)
}
