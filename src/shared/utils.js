import BigNumber from 'bignumber.js'

const format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3
}

BigNumber.config({ FORMAT: format })

export function smartRound(client, weiAmount) {
  let n = Number.parseFloat(client.fromWei(weiAmount), 10)
  let decimals = -Math.log10(n) + 10
  if (decimals < 2) {
    decimals = 2
  } else if (decimals >= 18) {
    decimals = 18
  }
  // round extra decimals and remove trailing zeroes
  return new BigNumber(n.toFixed(Math.ceil(decimals))).toFormat()
}

export function sanitize(amount = '') {
  return amount.replace(',', '.')
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
    weiAmount = client.toBN(client.toWei(sanitize(amount)))
    isValidAmount = weiAmount.gte(client.toBN(0))
  } catch (e) {
    isValidAmount = false
  }

  const expectedMETamount = isValidAmount
    ? client.toWei(
        weiAmount
          .dividedBy(client.toBN(rate))
          .decimalPlaces(18)
          .toString(10)
      )
    : errorValue

  const excedes = isValidAmount
    ? client.toBN(expectedMETamount).gte(client.toBN(remaining))
    : null

  const usedETHAmount =
    isValidAmount && excedes
      ? client
          .toBN(remaining)
          .multipliedBy(client.toBN(rate))
          .dividedBy(client.toBN(client.toWei('1')))
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
