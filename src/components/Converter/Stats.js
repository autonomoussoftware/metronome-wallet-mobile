import { Text, View } from '../common'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'

export default class Stats extends React.Component {
  static propTypes = {
    converterPriceUSD: PropTypes.string.isRequired,
    converterStatus: PropTypes.shape({
      availableEth: PropTypes.string.isRequired,
      availableMet: PropTypes.string.isRequired
    })
  }

  render() {
    const { converterPriceUSD, converterStatus } = this.props

    return (
      <View bg="lightShade" mt={2}>
        <View style={[styles.row, styles.topRow]}>
          <Text>Current Price</Text>
          <View>
            <View row align="center">
              <Text color="primary" size="medium" mr={1}>
                1 MET =
              </Text>
              <Text size="medium">{converterStatus.currentPrice} ETH</Text>
            </View>
            <Text opacity={0.8} size="small" align="right">
              ${converterPriceUSD}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text>Available MET</Text>
          <Text size="medium">{converterStatus.availableMet} MET</Text>
        </View>

        <View style={styles.row}>
          <Text>Available ETH</Text>
          <Text size="medium">{converterStatus.availableEth} MET</Text>
        </View>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(1),
    borderTopWidth: 1,
    borderTopColor: theme.colors.darkShade
  },
  topRow: {
    borderTopColor: theme.colors.transparent
  }
})
