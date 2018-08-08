import { DisplayValue, Text, View } from '../common'
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
        <View style={[styles.row, styles.topRow]} py={1} px={2}>
          <Text weight="semibold" size="medium">
            Current Price
          </Text>
          <View>
            <View row align="center">
              <View bg="primary" style={styles.badge}>
                <Text
                  color="light"
                  size="medium"
                  mr={1}
                  align="center"
                  my={0.3}
                  mx={0.6}
                >
                  1 MET
                </Text>
              </View>
              <DisplayValue
                value={converterStatus.currentPrice}
                size="medium"
                pre=" = "
                post=" ETH"
              />
            </View>
            <Text opacity={0.8} size="small" align="right">
              ${converterPriceUSD} (USD)
            </Text>
          </View>
        </View>

        <View style={styles.row} p={2}>
          <Text weight="semibold" size="medium">
            Available MET
          </Text>
          <DisplayValue
            value={converterStatus.availableMet}
            size="medium"
            post=" MET"
          />
        </View>

        <View style={styles.row} p={2}>
          <Text weight="semibold" size="medium">
            Available ETH
          </Text>
          <DisplayValue
            value={converterStatus.availableEth}
            size="medium"
            post=" ETH"
          />
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
    borderTopWidth: 1,
    borderTopColor: theme.colors.darkShade
  },
  topRow: {
    borderTopColor: theme.colors.transparent
  },
  badge: {
    borderRadius: 12
  }
})
