import { SafeAreaView, StyleSheet, Button, Text, View } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bip39 from 'react-native-bip39';
import theme from './config/theme';

export default class MnemonicGenerator extends Component {
  static propTypes = {
    onMnemonic: PropTypes.func.isRequired
  };

  state = { mnemonic: '' };

  componentDidMount() {
    bip39.generateMnemonic().then(mnemonic => this.setState({ mnemonic }));
  }

  onDonePressed = () => this.props.onMnemonic(this.state.mnemonic);

  render() {
    const { mnemonic } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.title}>
            Write down these words and keep them safe. They will allow you to
            recover your funds in case you loose this device or uninstall the
            app.
          </Text>
          <View style={styles.mnemonic}>
            {mnemonic.split(' ').map((word, i) => (
              <Text key={i} style={styles.word}>
                {word}
              </Text>
            ))}
          </View>
          <Button onPress={this.onDonePressed} title="Done" />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: theme.fonts.sizes.normal,
    marginVertical: 20
  },
  mnemonic: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 30
  },
  word: {
    fontSize: theme.fonts.sizes.large,
    color: theme.colors.primary,
    fontWeight: '800',
    marginVertical: 15,
    marginHorizontal: 10
  }
});
