import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  Text,
  View
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bip39 from 'react-native-bip39';
import theme from './config/theme';

export default class RecoverFromMnemonic extends Component {
  static navigationOptions = {
    drawerLabel: 'Recover from 12 words'
  };

  static propTypes = {
    screenProps: PropTypes.shape({
      onMnemonic: PropTypes.func.isRequired
    }).isRequired
  };

  state = {
    input: null,
    error: null
  };

  onDonePressed = () => {
    const { input } = this.state;
    if (bip39.validateMnemonic(input)) {
      this.props.screenProps.onMnemonic(input);
    } else {
      this.setState({
        error: "These words don't look like a valid recovery phrase."
      });
    }
  };

  onInputChanged = input => {
    this.setState({ input, error: null });
  };

  render() {
    const { input, error } = this.state;

    const weHave12words =
      input &&
      input
        .trim()
        .split(' ')
        .map(w => w.trim())
        .filter(w => w.length > 0).length === 12;

    return (
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.title}>
            Enter the 12 words to recover your wallet.
          </Text>
          <Text style={styles.warning}>
            This action will replace your current stored seed!
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={this.onInputChanged}
              value={input}
              numberOfLines={3}
              multiline={true}
              secureTextEntry
              autoGrow
              returnKeyType="done"
            />
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
          <Button
            disabled={!weHave12words}
            onPress={this.onDonePressed}
            title="Done"
          />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20
  },
  title: {
    fontSize: theme.fonts.sizes.normal
  },
  warning: {
    fontWeight: '800',
    marginVertical: 20,
    color: theme.colors.dark
  },
  input: {
    padding: 5,
    fontSize: theme.fonts.sizes.normal,
    minHeight: 100,
    backgroundColor: theme.colors.bg.light
  },
  error: {
    marginVertical: 20,
    color: theme.colors.danger
  }
});
