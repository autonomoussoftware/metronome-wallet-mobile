import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'
import RN from 'react-native'

import { DisplayValue, Text, View } from '../common'

const isNarrow = RN.Dimensions.get('window').width < 375

export default class Stats extends React.Component {
  static propTypes = {
    auctionPriceUSD: PropTypes.string.isRequired,
    auctionStatus: PropTypes.shape({
      tokenRemaining: PropTypes.string.isRequired,
      currentPrice: PropTypes.string.isRequired
    })
  }

  render() {
    const { auctionPriceUSD, auctionStatus } = this.props

    return (
      <View bg="lightShade" mt={2}>
        <View
          justify="space-between"
          align="baseline"
          row={!isNarrow}
          py={1}
          px={2}
        >
          <Text weight="semibold" size="medium">
            Current Price
          </Text>
          <View alignSelf={'flex-end'} mt={isNarrow ? 1 : 0}>
            <View row align="center">
              <View bg="primary" style={styles.badge}>
                <Text
                  align="center"
                  color="light"
                  size="small"
                  my={0.3}
                  mx={0.6}
                  mr={1}
                >
                  1 MET
                </Text>
              </View>
              <DisplayValue
                isCoin
                value={auctionStatus.currentPrice}
                size="medium"
                pre=" = "
              />
            </View>
            <Text opacity={0.8} size="small" align="right">
              ${auctionPriceUSD} (USD)
            </Text>
          </View>
        </View>

        <View
          justify="space-between"
          style={styles.topBorder}
          align="baseline"
          row
          p={2}
        >
          <Text weight="semibold" size="medium">
            Available
          </Text>
          <DisplayValue
            value={auctionStatus.tokenRemaining}
            size="medium"
            post=" MET"
          />
        </View>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  topBorder: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.darkShade
  },
  badge: {
    top: 1,
    borderRadius: 12
  }
})
