import BigNumber from 'bignumber.js'

const format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3
}

BigNumber.config({ FORMAT: format })

export function sanitize(amount = '') {
  return amount.replace(',', '.')
}

/**
 * Removes extra spaces and converts to lowercase
 * Useful for sanitizing user input before recovering a wallet.
 *
 * @param {string} str The string to sanitize
 */
export function sanitizeMnemonic(str) {
  return str
    .replace(/\s+/gi, ' ')
    .trim()
    .toLowerCase()
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

export function toUSD(client, amount, rate, errorValue = 'Invalid amount') {
  let isValidAmount
  let usdAmount
  try {
    if (!isWeiable(client, sanitize(amount))) throw new Error()
    usdAmount = parseFloat(sanitize(amount), 10) * parseFloat(rate, 10)
    isValidAmount = usdAmount >= 0
  } catch (e) {
    isValidAmount = false
  }
  const expectedUSDamount = isValidAmount ? usdAmount.toString(10) : errorValue
  return expectedUSDamount
}

export function toETH(client, amount, rate, errorValue = 'Invalid amount') {
  let isValidAmount
  let weiAmount
  try {
    weiAmount = client.toBN(client.toWei(sanitize(amount)))
    isValidAmount = weiAmount.gte(client.toBN(0))
  } catch (e) {
    isValidAmount = false
  }

  const expectedETHamount = isValidAmount
    ? weiAmount
        .dividedBy(client.toBN(client.toWei(String(rate))))
        .decimalPlaces(18)
        .toString(10)
    : errorValue

  return expectedETHamount
}

export function toMET(
  client,
  amount,
  rate,
  errorValue = 'Invalid amount',
  remaining
) {
  let isValidAmount
  let weiAmount
  try {
    weiAmount = new BigNumber(client.toWei(sanitize(amount)))
    isValidAmount = weiAmount.gte(new BigNumber(0))
  } catch (e) {
    isValidAmount = false
  }

  const expectedMETamount = isValidAmount
    ? client.toWei(
        weiAmount
          .dividedBy(new BigNumber(rate))
          .decimalPlaces(18)
          .toString(10)
      )
    : errorValue

  const excedes = isValidAmount
    ? client.toBN(expectedMETamount).gt(client.toBN(remaining))
    : null

  const usedETHAmount =
    isValidAmount && excedes
      ? new BigNumber(remaining)
          .multipliedBy(new BigNumber(rate))
          .dividedBy(new BigNumber(client.toWei('1')))
          .decimalPlaces(18)
          .toString(10)
      : null

  const excessETHAmount =
    isValidAmount && excedes
      ? weiAmount.minus(usedETHAmount).toString(10)
      : null

  return { expectedMETamount, excedes, usedETHAmount, excessETHAmount }
}

export function syncAmounts(state, ETHprice, id, value, client) {
  return {
    ...state,
    usdAmount:
      id === 'ethAmount' ? toUSD(client, value, ETHprice) : state.usdAmount,
    ethAmount:
      id === 'usdAmount' ? toETH(client, value, ETHprice) : state.ethAmount
  }
}
