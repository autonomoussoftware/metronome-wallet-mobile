import BigNumber from 'bignumber.js'

const format = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3
}

BigNumber.config({ FORMAT: format })

/**
 * Returns the ETH/MET rate of a conversion
 * Useful for displaying the obtained rate after a conversion estimate
 *
 * @param {Object} client - The client object
 * @param {string} metAmount - The MET amount provided or obtained (in wei)
 * @param {string} ethAmount - The ETH amount provided or obtained (in wei)
 */
export function getConversionRate(client, metAmount, ethAmount) {
  const compareAgainst = client.fromWei(metAmount)
  return new BigNumber(ethAmount)
    .dividedBy(new BigNumber(compareAgainst))
    .integerValue()
    .toString(10)
}
