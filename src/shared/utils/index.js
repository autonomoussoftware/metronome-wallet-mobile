import { sanitize } from './sanitizers'
import BigNumber from 'bignumber.js'

export { sanitizeMnemonic, sanitizeInput, sanitize } from './sanitizers'
export { createTransactionParser } from './createTransactionParser'
export { getAmountFieldsProps } from './getAmountFieldsProps'
export { getPurchaseEstimate } from './getPurchaseEstimate'
export { getConversionRate } from './getConversionRate'
export { messageParser } from './messageParser'
export { syncAmounts } from './syncAmounts'

export function hasFunds(value) {
  return value && new BigNumber(value).gt(new BigNumber(0))
}

export function isWeiable(client, amount, unit = 'ether') {
  let isValid
  try {
    client.toWei(sanitize(amount), unit)
    isValid = true
  } catch (e) {
    isValid = false
  }
  return isValid
}

export function isHexable(client, amount) {
  let isValid
  try {
    client.toHex(amount)
    isValid = true
  } catch (e) {
    isValid = false
  }
  return isValid
}

export function isGreaterThanZero(client, amount) {
  const weiAmount = client.toBN(client.toWei(sanitize(amount)))
  return weiAmount.gt(client.toBN(0))
}

export function isFailed(tx, confirmations) {
  return (
    (tx.txType === 'auction' && !tx.mtnBoughtInAuction && confirmations > 0) ||
    tx.contractCallFailed
  )
}

export function isPending(tx, confirmations) {
  return !isFailed(tx, confirmations) && confirmations < 6
}
