import { Text, View } from '../common';
import PropTypes from 'prop-types';
import theme from '../../theme';
import React from 'react';
import RN from 'react-native';

export default class Stats extends React.Component {
  static propTypes = {
    auctionPriceUSD: PropTypes.string.isRequired,
    auctionStatus: PropTypes.shape({
      tokenRemaining: PropTypes.string.isRequired,
      currentPrice: PropTypes.string.isRequired
    })
  };

  render() {
    const { auctionPriceUSD, auctionStatus } = this.props;

    return (
      <View bg="lightShade" mt={2}>
        <View style={[styles.row, styles.topRow]}>
          <Text>Current Price</Text>
          <View>
            <View row align="center">
              <Text color="primary" size="medium" mr={1}>
                1 MET =
              </Text>
              <Text size="medium">{auctionStatus.currentPrice} ETH</Text>
            </View>
            <Text opacity={0.8} size="small" align="right">
              ${auctionPriceUSD}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text>Available</Text>
          <Text size="medium">{auctionStatus.tokenRemaining} MET</Text>
        </View>
      </View>
    );
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
});
