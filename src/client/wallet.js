import * as Keychain from 'react-native-keychain';

export const getSeed = () =>
  Keychain.getGenericPassword()
    .then(credentials => credentials.password)

export const setSeed = seed =>
  Keychain.setGenericPassword('wallet.seed', seed)
