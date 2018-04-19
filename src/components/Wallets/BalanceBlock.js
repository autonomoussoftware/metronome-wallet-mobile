import withBalanceBlockState from '../../shared/hocs/withBalanceBlockState';
import { View, Text } from '../common';
import PropTypes from 'prop-types';
import theme from '../../theme';
import React from 'react';
import RN from 'react-native';

class BalanceBlock extends React.Component {
  static propTypes = {
    mtnBalanceWei: PropTypes.string.isRequired,
    mtnBalanceUSD: PropTypes.string.isRequired,
    ethBalanceWei: PropTypes.string.isRequired,
    ethBalanceUSD: PropTypes.string.isRequired
  };

  render() {
    return (
      <View bg="lightShade" px={2}>
        <Row
          usdValue={this.props.ethBalanceUSD}
          isFirst
          symbol="ETH"
          value={this.props.ethBalanceWei}
        />
        <Row symbol="MET" value={this.props.mtnBalanceWei} />
      </View>
    );
  }
}

const Row = ({ symbol, value, usdValue, isFirst }) => (
  <View
    style={[styles.balanceRow, isFirst && styles.isFirst]}
    align="flex-start"
    row
    py={2}
  >
    <View style={styles.symbol} bg="primary" py={0.5} px={1.5} mt={0.5}>
      <Text size="large">{symbol}</Text>
    </View>
    <View ml={2}>
      <Text size="xxLarge">{value}</Text>
      {usdValue && (
        <Text size="medium" opacity={0.8}>
          ${usdValue} USD
        </Text>
      )}
    </View>
  </View>
);

Row.propTypes = {
  usdValue: PropTypes.string,
  isFirst: PropTypes.bool,
  symbol: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

const styles = RN.StyleSheet.create({
  container: {},
  symbol: {
    borderRadius: 8
  },
  balanceRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.darkShade
  },
  isFirst: {
    borderTopColor: 'transparent'
  }
});

export default withBalanceBlockState(BalanceBlock);
