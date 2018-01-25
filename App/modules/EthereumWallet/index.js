import { StyleSheet, Text, View } from 'react-native';
import React, { Component } from 'react';
// import EthereumTx from 'ethereumjs-tx';
import PropTypes from 'prop-types';
import settings from '../../config/settings';
import ethutils from 'ethereumjs-util';
import moment from 'moment';
import hdkey from 'ethereumjs-wallet/hdkey';
import theme from '../../config/theme';
import axios from 'axios';
import Web3 from 'web3';
import api from './ethapi';

export default class EthereumWallet extends Component {
  static navigationOptions = {
    drawerLabel: 'Metronome wallet'
  };

  static propTypes = {
    screenProps: PropTypes.shape({
      seed: PropTypes.string.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      addresses: this.generateAddresses(props.screenProps.seed),
      bestBlock: null,
      balance: null
    };
  }

  generateAddresses(seed, amount = 5) {
    let addresses = [];

    for (let i = 0; i <= amount; i++) {
      const wallet = hdkey
        .fromMasterSeed(ethutils.toBuffer('0x' + seed))
        .derivePath(`m/44'/60'/0'/0/${i}`)
        .getWallet();
      addresses.push({
        address: wallet.getChecksumAddressString(),
        privKey: wallet.getPrivateKey(),
        pubKey: wallet.getPublicKey()
      });
    }
    return addresses;
  }

  componentWillMount() {
    const selectedAddress = this.state.addresses[0].address;

    this.subscription = api.eth.subscribe('newBlockHeaders', (error, block) =>
      this.setState({ bestBlock: block.number })
    );
    axios
      .get(`${settings.MTN_API_URL}/account/${selectedAddress}`)
      .then(({ data }) =>
        this.setState({
          balance: Web3.utils.fromWei(data.balance)
        })
      )
      .catch(() => this.setState({ balance: '0' }));
    axios
      .get(`${settings.MTN_API_URL}/event/account/${selectedAddress}`)
      .then(({ data }) =>
        this.setState({
          lastTransactions: data.events
            .map(({ metaData }) => metaData)
            .sort((a, b) => a.timestamp < b.timestamp)
        })
      )
      .catch(e => this.setState({ e: e.message }));
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  /* Transaction how-to
  onSendPress = () => {
    const tx = new EthereumTx({
      from: this.state.addresses[0].address,
      to: settings.MTN_AUCTION_ADDR,
      value: '100000',
      gas: 88415,
      nonce: 1
    });

    tx.sign(this.state.addresses[0].privKey);

    api.eth
      .sendSignedTransaction('0x' + tx.serialize().toString('hex'))
      .on('transactionHash', transactionHash =>
        this.setState({ transactionHash })
      )
      .on('receipt', receipt => this.setState({ receipt }))
      .on('confirmation', (confirmationNumber, receipt) =>
        this.setState({ confirmationNumber, receipt })
      )
      .on('error', e => this.setState({ status: 'failure', error: e.message }));
  };
  */

  render() {
    const currentAddress = this.state.addresses[0].address;
    const { balance, bestBlock } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Address</Text>
          <Text
            style={styles.instructions}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {currentAddress}
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
          {this.state.lastTransactions &&
          this.state.lastTransactions.length > 0 ? (
            this.state.lastTransactions.map(tx => (
              <View style={styles.txRow} key={tx.id}>
                <View>
                  <Text style={styles.txType}>
                    {tx.returnValues._from === currentAddress
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

        <View style={styles.row}>
          <Text style={styles.label}>Latest block</Text>
          {bestBlock ? (
            <Text style={styles.instructions}>{bestBlock}</Text>
          ) : (
            <Text style={styles.txTime}>Waiting...</Text>
          )}
        </View>
      </View>
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
