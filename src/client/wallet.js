import * as Keychain from 'react-native-keychain'

export const getSeed = () =>
  Keychain.getInternetCredentials('wallet.seed')
    .then(credentials => credentials.password)

export const setSeed = seed =>
  Keychain.setInternetCredentials('wallet.seed', 'seed', seed)

