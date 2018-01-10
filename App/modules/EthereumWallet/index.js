import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import Web3 from 'web3'

const defaultAddress = '0x001f6BC290bA84C65b7D17a49C701D583C08f86B'

export default class UI extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    const provider = new Web3.providers.WebsocketProvider('ws://parity.bloqrock.net:8546/')
    const web3 = new Web3(provider)

    const component = this
    web3.eth.subscribe('newBlockHeaders', function(error, block){
      component.setState({ bestBlock: block.number })
    });
    web3.eth.getBalance(defaultAddress).then(function (balance) {
      component.setState({ balance: web3.utils.fromWei(balance, 'ether') })
    })
  }

  render() {
    const { balance, bestBlock } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Account balance is {balance}
        </Text>
        <Text style={styles.instructions}>
          Latest block is {bestBlock}
        </Text>
      </View>
    );
  }
}

const ethereumColors = {
  purple: '#7e61f8',
  white: '#fff'
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ethereumColors.purple,
    padding: 8
  },
  instructions: {
    textAlign: 'center',
    color: ethereumColors.white,
  },
});
