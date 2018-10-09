import { sanitizeInput, sanitize } from './sanitizers'
import BigNumber from 'bignumber.js'

const ERROR_VALUE_PLACEHOLDER = 'Invalid amount'
const SMALL_VALUE_PLACEHOLDER = '< 0.01'

function getWeiUSDvalue(client, amount, rate) {
  const amountBN = client.toBN(amount)
  const rateBN = client.toBN(
    client.toWei(typeof rate === 'string' ? rate : rate.toString())
  )
  return amountBN.mul(rateBN).div(client.toBN(client.toWei('1')))
}

function toUSD(client, amount, rate) {
  let isValidAmount
  let weiUSDvalue

  try {
    weiUSDvalue = getWeiUSDvalue(client, client.toWei(sanitize(amount)), rate)
    isValidAmount = weiUSDvalue.gte(client.toBN('0'))
  } catch (e) {
    isValidAmount = false
  }

  const expectedUSDamount = isValidAmount
    ? weiUSDvalue.isZero()
      ? '0'
      : weiUSDvalue.lt(client.toBN(client.toWei('0.01')))
        ? SMALL_VALUE_PLACEHOLDER
        : new BigNumber(client.fromWei(weiUSDvalue.toString()))
            .dp(2)
            .toString(10)
    : ERROR_VALUE_PLACEHOLDER

  return expectedUSDamount
}

function toETH(client, amount, rate) {
  let isValidAmount
  let weiAmount
  try {
    weiAmount = new BigNumber(client.toWei(sanitize(amount)))
    isValidAmount = weiAmount.gte(new BigNumber(0))
  } catch (e) {
    isValidAmount = false
  }

  const expectedETHamount = isValidAmount
    ? weiAmount
        .dividedBy(new BigNumber(client.toWei(String(rate))))
        .decimalPlaces(18)
        .toString(10)
    : ERROR_VALUE_PLACEHOLDER

  return expectedETHamount
}

/**
 * Returns an updated state with ETH and USD values are synced
 * Useful for updating a pair of ETH - USD inputs
 *
 * @param {Object} params - Params required for the conversion
 * @param {string} params.state - The initial component state
 * @param {string} params.ETHprice - The ETH/USD rate
 * @param {string} params.id - The id of the field being updated
 * @param {string} params.value - The new value of the field being updated
 * @param {string} params.client - The client object
 */
export function syncAmounts({ state, ETHprice, id, value, client }) {
  const sanitizedValue = sanitizeInput(value)
  return {
    ...state,
    usdAmount:
      id === 'ethAmount'
        ? toUSD(client, sanitizedValue, ETHprice)
        : state.usdAmount,
    ethAmount:
      id === 'usdAmount'
        ? toETH(client, sanitizedValue, ETHprice)
        : state.ethAmount
  }
}
