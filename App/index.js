import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  View
} from 'react-native';
import React, { Component } from 'react';
import EthereumWallet from './modules/EthereumWallet';
import hdkey from 'ethereumjs-wallet/hdkey';
import bip39 from 'react-native-bip39';
import theme from './config/theme';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      mnemonic: null,
      isReady: false,
      seed: null
    };
  }

  componentDidMount() {
    bip39.generateMnemonic().then(mnemonic => {
      const seed = bip39.mnemonicToSeed(mnemonic);

      let addresses = [];

      for (let i = 0; i <= 5; i++) {
        const wallet = hdkey
          .fromMasterSeed(seed)
          .derivePath(`m/44'/60'/0'/0/${i}`)
          .getWallet();
        addresses.push({
          address: wallet.getChecksumAddressString(),
          privKey: wallet.getPrivateKey(),
          pubKey: wallet.getPublicKey()
        });
      }

      this.setState({
        addresses,
        mnemonic,
        isReady: true,
        seed
      });
    });
  }

  render() {
    const { mnemonic, addresses, isReady, seed } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.header}>
          <Text style={styles.title}>metronome wallet</Text>
        </SafeAreaView>

        {isReady ? (
          <ScrollView>
            <EthereumWallet addresses={addresses} />
            {mnemonic ? (
              <Text style={styles.label}>Mnemonic: {mnemonic}</Text>
            ) : null}

            {seed ? <Text style={styles.label}>Seed: {seed}</Text> : null}

            {addresses.map(({ address }, i) => (
              <Text key={i} style={styles.label}>
                address {i}: {address}
              </Text>
            ))}
          </ScrollView>
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: theme.colors.bg.white
  },
  header: {
    backgroundColor: theme.colors.bg.light
  },
  title: {
    lineHeight: 24,
    textAlign: 'center'
  },
  label: {
    marginVertical: 10
  }
});
