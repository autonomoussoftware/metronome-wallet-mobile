import { AsyncStorage } from 'react-native'

export const getAddress = () =>
  AsyncStorage.getItem('wallet.address')

export const setAddress = address =>
  AsyncStorage.setItem('wallet.address', address)
