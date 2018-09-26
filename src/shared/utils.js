import smartRounder from 'smart-round'
import BigNumber from 'bignumber.js'
import config from '../config'

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

export function getConversionRate(client, metAmount, ethAmount) {
  const compareAgainst = client.fromWei(metAmount)
  return new BigNumber(ethAmount)
    .dividedBy(new BigNumber(compareAgainst))
    .integerValue()
    .toString(10)
}

/**
 * Perform an array of common replacements on strings
 * Each replacement is defined by an object of shape { search, replaceWith }
 * 'search' and 'replaceWith' are used as first and second argument of
 * String.prototype.replace() so the same specs apply.
 *
 * @param {string} str A message string.
 */
export function messageParser(str) {
  const replacements = [
    { search: config.MET_TOKEN_ADDR, replaceWith: 'MET TOKEN CONTRACT' },
    { search: config.CONVERTER_ADDR, replaceWith: 'CONVERTER CONTRACT' },
    { search: /(.*gas too low.*)/gim, replaceWith: () => 'Gas too low.' },
    {
      search: /(.*insufficient funds for gas \* price \+ value.*)/gim,
      replaceWith: () => "You don't have enough funds for this transaction."
    },
    {
      search: /(.*Insufficient\sfunds.*Required\s)(\d+)(\sand\sgot:\s)(\d+)(.*)/gim,
      // eslint-disable-next-line max-params
      replaceWith: (match, p1, p2, p3, p4, p5) => {
        const rounder = smartRounder(6, 0, 18)
        return [
          p1,
          rounder(p2, true),
          ' ETH',
          p3,
          rounder(p4, true),
          ' ETH',
          p5
        ].join('')
      }
    }
  ]

  return replacements.reduce(
    (output, { search, replaceWith }) => output.replace(search, replaceWith),
    str
  )
}
