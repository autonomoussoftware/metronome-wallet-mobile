import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'

import { metronomeColors } from './config/styles'

import EthereumWallet from './modules/EthereumWallet'

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>metronome wallet</Text>
        </View>
        <EthereumWallet />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: metronomeColors.white
  },
  header: {
    height: 64,
    paddingTop: 30,
    backgroundColor: metronomeColors.lightGray,
  },
  title: {
    textAlign: 'center'
  }
})
