import { SafeAreaView, View, Text, StyleSheet, Button } from 'react-native';
import CountDown from '../../common/CountDown';
import settings from '../../config/settings';
import moment from 'moment';
import theme from '../../config/theme';
import React from 'react';
import Web3 from 'web3';
import io from 'socket.io-client';

export default class AuctionBoard extends React.Component {
  static navigationOptions = {
    drawerLabel: 'MTN Auction Board'
  };

  state = { status: null };

  componentDidMount() {
    this.socket = io(settings.MTN_API_URL);
    this.socket.on(settings.WS_AUCTION_STATUS_TOPIC, status =>
      this.setState({ status })
    );
  }

  componentWillUnmount() {
    if (this.socket) this.socket.close();
  }

  render() {
    const { status } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView>
          {status && (
            <View>
              <View style={styles.row}>
                <Text style={styles.label}>Current price</Text>
                <Text style={styles.large}>
                  {Web3.utils.fromWei(status.currentPrice)} ETH
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Last purchased</Text>
                <Text style={styles.value}>
                  {moment.unix(status.lastPurchaseTime).fromNow()}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.next}>Next auction starts in</Text>
                <CountDown targetTimestamp={status.nextAuctionStartTime} />
              </View>
              <View style={styles.row}>
                <Button title="Buy MTN" onPress={_ => _} />
              </View>
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.bg.dark,
    padding: 20,
    flex: 1
  },
  row: {
    marginVertical: 20
  },
  label: {
    fontSize: theme.fonts.sizes.normal,
    color: theme.colors.primary
  },
  value: {
    color: theme.colors.light,
    fontSize: theme.fonts.sizes.small
  },
  next: {
    fontSize: theme.fonts.sizes.small,
    textAlign: 'center',
    color: theme.colors.light
  },
  large: {
    color: theme.colors.light,
    fontSize: theme.fonts.sizes.xLarge
  }
});
