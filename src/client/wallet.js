import { AsyncStorage } from 'react-native'
import * as Keychain from 'react-native-keychain';

export const getAddress = () =>
  AsyncStorage.getItem('wallet.address')

export const setAddress = address =>
  AsyncStorage.setItem('wallet.address', address)

export const getPrivateKey = () =>
  Keychain.getGenericPassword()
    .then(credentials => credentials.password)

export const setPrivateKey = privateKey =>
  Keychain.setGenericPassword('wallet.privateKey', privateKey)
  