import { DisplayValue, View, Text } from '../common'
import withBalanceBlockState from '../../shared/hocs/withBalanceBlockState'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'

class BalanceBlock extends React.Component {
  static propTypes = {
    mtnBalanceWei: PropTypes.string.isRequired,
    mtnBalanceUSD: PropTypes.string.isRequired,
    ethBalanceWei: PropTypes.string.isRequired,
    ethBalanceUSD: PropTypes.string.isRequired
  }

  render() {
    return (
      <View bg="lightShade" px={2}>
        <Row isFirst isBig symbol="MET" value={this.props.mtnBalanceWei} />
        <Row
          usdValue={this.props.ethBalanceUSD}
          symbol="ETH"
          value={this.props.ethBalanceWei}
        />
      </View>
    )
  }
}

const Row = ({ symbol, value, usdValue, isFirst, isBig }) => (
  <View
    style={[styles.balanceRow, isFirst && styles.isFirst]}
    align="flex-start"
    row
    py={2}
  >
    <View style={styles.symbol} bg="primary" py={0.5} px={1.5} mt={0.5}>
      <Text size="large" weight="semibold">
        {symbol}
      </Text>
    </View>
    <View grow={1} shrink={1} ml={2}>
      <DisplayValue
        shadow
        value={value}
        size={isBig ? 'xxLarge' : 'xLarge'}
        ls={-0.7}
      />

      {usdValue && (
        <Text size="medium" weight="semibold" opacity={0.8}>
          ${usdValue} (USD)
        </Text>
      )}
    </View>
  </View>
)

Row.propTypes = {
  usdValue: PropTypes.string,
  isFirst: PropTypes.bool,
  symbol: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isBig: PropTypes.bool
}

const styles = RN.StyleSheet.create({
  symbol: {
    borderRadius: 14
  },
  balanceRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.darkShade
  },
  isFirst: {
    borderTopColor: 'transparent'
  }
})

export default withBalanceBlockState(BalanceBlock)
