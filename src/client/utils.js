import coreUtils from 'metronome-wallet-core/utils'
import utils from 'web3-utils'

export const fromWei = (str, unit = 'ether') => utils.fromWei(str, unit)
export const toWei = (bn, unit = 'ether') => utils.toWei(bn, unit)

export const fromCoin = (config, str) =>
  coreUtils[config.chainType][config.chainId].fromCoin(str)

export const toCoin = (config, str) =>
  coreUtils[config.chainType][config.chainId].toCoin(str)

export const isAddress = (config, str) =>
  coreUtils[config.chainType][config.chainId].isAddress(str)

export const toBN = str => utils.toBN(str)
export const toHex = bn => utils.toHex(bn)
