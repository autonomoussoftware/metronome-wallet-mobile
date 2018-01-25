import { ActivityIndicator, StyleSheet } from 'react-native';
import { retrieveSeed, storeSeed } from './seedStorage';
import React, { Component } from 'react';
import MnemonicGenerator from './MnemonicGenerator';
import Router from './Router';
import bip39 from 'react-native-bip39';
import theme from './config/theme';

export default class App extends Component {
  state = {
    isReady: false,
    seed: null
  };

  componentDidMount() {
    retrieveSeed().then(
      seed => this.setState({ isReady: true, seed }),
      () => this.setState({ isReady: true })
    );
  }

  onMnemonic = mnemonic => {
    this.setState({ isReady: false }, () => {
      const seed = bip39.mnemonicToSeedHex(mnemonic);
      storeSeed(seed).then(() => this.setState({ seed, isReady: true }));
    });
  };

  render() {
    const { isReady, seed } = this.state;

    return isReady ? (
      seed ? (
        <Router screenProps={{ seed, onMnemonic: this.onMnemonic }} />
      ) : (
        <MnemonicGenerator onMnemonic={this.onMnemonic} />
      )
    ) : (
      <ActivityIndicator style={styles.spinner} />
    );
  }
}

const styles = StyleSheet.create({
  spinner: {
    backgroundColor: theme.colors.bg.dark,
    flex: 1
  }
});
