import withBalanceBlockState from 'metronome-wallet-ui-logic/src/hocs/withBalanceBlockState'
import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'
import RN from 'react-native'

import { DisplayValue, View, Text } from '../common'

class BalanceBlock extends React.Component {
  static propTypes = {
    metBalanceWei: PropTypes.string.isRequired,
    coinBalanceWei: PropTypes.string.isRequired,
    coinBalanceUSD: PropTypes.string.isRequired,
    coinSymbol: PropTypes.string.isRequired
  }

  render() {
    return (
      <View bg="lightShade" px={2}>
        <Row isFirst isBig symbol="MET" value={this.props.metBalanceWei} />
        <Row
          useDecimals
          usdValue={this.props.coinBalanceUSD}
          symbol={this.props.coinSymbol}
          value={this.props.coinBalanceWei}
        />
      </View>
    )
  }
}

const Row = ({ useDecimals, symbol, value, usdValue, isFirst, isBig }) => (
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
        useDecimals={useDecimals}
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
  useDecimals: PropTypes.bool,
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
    borderTopWidth: RN.StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.darkShade
  },
  isFirst: {
    borderTopColor: 'transparent'
  }
})

export default withBalanceBlockState(BalanceBlock)
