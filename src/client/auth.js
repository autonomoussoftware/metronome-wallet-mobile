import { AsyncStorage } from 'react-native'
import fastPasswordEntropy from 'fast-password-entropy'

// TODO no longer needed once password is replaced
export const getStringEntropy = str =>
  fastPasswordEntropy(str)

// FIX these shall be stored in the secure storage of the device
export const getWalletSeed = () =>
  AsyncStorage.getItem('wallet.seed')
    .then(seed => seed || Promise.reject())

export const setWalletSeed = seed =>
  AsyncStorage.setItem('wallet.seed', seed)
