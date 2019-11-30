import { validatePIN, getStringEntropy } from '../auth'
import { createMnemonic, isValidMnemonic } from '../keys'
import {
  recoverFromMnemonic,
  onTermsLinkClick,
  onHelpLinkClick,
  copyToClipboard,
  getAppVersion,
  onLinkClick,
  clearCache
} from '../platform-utils'
import {
  isAddress,
  fromCoin,
  fromWei,
  toCoin,
  toWei,
  toBN,
  toHex
} from '../utils'

export default {
  recoverFromMnemonic,
  getStringEntropy,
  onTermsLinkClick,
  onHelpLinkClick,
  copyToClipboard,
  isValidMnemonic,
  createMnemonic,
  getAppVersion,
  onLinkClick,
  validatePIN,
  clearCache,
  isAddress,
  fromCoin,
  fromWei,
  toCoin,
  toWei,
  toHex,
  toBN
}
