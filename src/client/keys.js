import bip39 from 'react-native-bip39'

export const createMnemonic = () =>
  bip39.generateMnemonic()

export const isValidMnemonic = mnemonic =>
  bip39.validateMnemonic(mnemonic)

export const mnemonicToSeedHex = mnemonic =>
  bip39.mnemonicToSeedHex(mnemonic).toString('hex')
