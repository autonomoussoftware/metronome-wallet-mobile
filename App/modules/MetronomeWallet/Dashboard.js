import { StyleSheet, Text, View } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Wallet from './Wallet';
import theme from '../../config/theme';
import Web3 from 'web3';

export default class Dashboard extends Component {
  static navigationOptions = {
    drawerLabel: 'Metronome wallet'
  };

  static propTypes = {
    screenProps: PropTypes.shape({
      seed: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    return (
      <Wallet seed={this.props.screenProps.seed}>
        {({ lastTransactions, balance, address }) => (
          <View style={styles.container}>
            <View style={styles.row}>
              <Text style={styles.label}>Address</Text>
              <Text
                style={styles.instructions}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {address}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Balance</Text>
              {balance === null ? (
                <Text style={styles.txTime}>Waiting...</Text>
              ) : (
                <Text
                  style={styles.balance}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  minimumFontScale={0.5}
                >
                  {balance} <Text style={styles.symbol}>MTN</Text>
                </Text>
              )}
            </View>

            <View style={styles.lastTransactions}>
              <Text style={styles.label}>Last transactions</Text>
              {lastTransactions && lastTransactions.length > 0 ? (
                lastTransactions.map(tx => (
                  <View style={styles.txRow} key={tx.id}>
                    <View>
                      <Text style={styles.txType}>
                        {tx.returnValues._from === address
                          ? 'Sent'
                          : 'Received'}
                      </Text>
                    </View>

                    <Text style={styles.txValue}>
                      {Web3.utils.fromWei(tx.returnValues._value)} MTN{' '}
                    </Text>
                    <Text style={styles.txTime}>
                      {moment.unix(tx.timestamp).fromNow()}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.txTime}>
                  There are no transactions for this address
                </Text>
              )}
            </View>
          </View>
        )}
      </Wallet>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: theme.colors.bg.dark,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  instructions: {
    color: theme.colors.light
  },
  row: {
    marginVertical: 20
  },
  label: {
    fontSize: 16,
    lineHeight: 28,
    color: theme.colors.primary
  },
  balance: {
    color: theme.colors.light,
    fontSize: 48
  },
  symbol: {
    fontSize: 24,
    opacity: 0.75
  },
  lastTransactions: {
    backgroundColor: theme.colors.bg.dark,
    paddingVertical: 10
  },
  txRow: {
    marginVertical: 10
  },
  txType: {
    fontSize: 14,
    color: theme.colors.light
  },
  txValue: {
    fontSize: 18,
    color: theme.colors.light
  },
  txTime: {
    color: theme.colors.light,
    opacity: 0.75
  }
});
