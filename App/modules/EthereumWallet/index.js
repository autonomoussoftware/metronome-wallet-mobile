import { StyleSheet, Text, View } from 'react-native';
import React, { Component } from 'react';
import EthereumTx from 'ethereumjs-tx';
import PropTypes from 'prop-types';
import settings from '../../config/settings';
import theme from '../../config/theme';
import Web3 from 'web3';

export default class UI extends Component {
  static propTypes = {
    addresses: PropTypes.arrayOf(
      PropTypes.shape({
        privKey: PropTypes.instanceOf(global.Buffer).isRequired,
        address: PropTypes.string.isRequired
      })
    ).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.web3 = new Web3(
      new Web3.providers.WebsocketProvider(settings.MTN_PUBLIC_NODE_URL)
    );
  }

  componentWillMount() {
    const component = this;
    this.web3.eth.subscribe('newBlockHeaders', function(error, block) {
      component.setState({ bestBlock: block.number });
    });
    this.web3.eth
      .getBalance(this.props.addresses[0].address)
      .then(function(balance) {
        component.setState({
          balance: Web3.utils.fromWei(balance, 'ether')
        });
      });
  }

  onSendPress = () => {
    const tx = new EthereumTx({
      from: this.props.addresses[0].address,
      to: settings.MTN_AUCTION_ADDR
      // value: '100000',
      // gas: 88415,
      // nonce: 21
    });

    tx.sign(this.props.addresses[0].privKey);

    this.web3.eth
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

  render() {
    const { balance, bestBlock } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>Account balance is {balance}</Text>
        <Text style={styles.instructions}>Latest block is {bestBlock}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.bg.primary,
    padding: 8
  },
  instructions: {
    textAlign: 'center',
    color: theme.colors.light
  }
});
