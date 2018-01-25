import {
  SafeAreaView,
  TextInput,
  View,
  Text,
  StyleSheet,
  Button,
  Modal
} from 'react-native';
import PurchaseFormProvider from '../../providers/PurchaseFormProvider';
import PropTypes from 'prop-types';
import theme from '../../config/theme';
import React from 'react';

export default class BuyModal extends React.Component {
  static propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    currentPrice: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired
  };

  static initialState = {
    disclaimerAccepted: true,
    input: null
  };

  state = BuyModal.initialState;

  componentWillReceiveProps(newProps) {
    if (newProps.isVisible !== this.props.isVisible) {
      this.setState(BuyModal.initialState);
    }
  }

  onInputChanged = input => this.setState({ input });

  render() {
    const { onRequestClose, isVisible, currentPrice } = this.props;
    const { input, disclaimerAccepted } = this.state;

    return (
      <Modal
        onRequestClose={onRequestClose}
        animationType={'slide'}
        visible={isVisible}
      >
        <SafeAreaView>
          <PurchaseFormProvider
            disclaimerAccepted={disclaimerAccepted}
            currentPrice={currentPrice}
            amount={input}
          >
            {({
              expectedMTNamount,
              isValidPurchase,
              isValidAmount,
              isPristine
            }) => (
              <View style={styles.container}>
                <Text style={styles.title}>Buy Metronome</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.fieldLabel}>ETH amount</Text>
                  <TextInput
                    returnKeyType="done"
                    numberOfLines={1}
                    onChangeText={this.onInputChanged}
                    keyboardType="numeric"
                    value={input === null ? '' : input}
                    placeholder="Enter a valid amount"
                    style={styles.input}
                  />
                </View>
                {expectedMTNamount && (
                  <View style={styles.expectedMTNamount}>
                    <Text style={styles.msg}>You would get</Text>
                    <Text style={styles.amount}>{expectedMTNamount} MTN</Text>
                  </View>
                )}
                {!isValidAmount &&
                  !isPristine && (
                    <Text style={styles.error}>Invalid ETH amount</Text>
                  )}
                <View style={styles.btnContainer}>
                  <Button onPress={onRequestClose} title="Cancel" />
                  <Button
                    disabled={!isValidPurchase}
                    onPress={_ => _}
                    title="Buy"
                  />
                </View>
              </View>
            )}
          </PurchaseFormProvider>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  title: {
    fontSize: theme.fonts.sizes.normal
  },
  inputContainer: {
    marginTop: 20
  },
  fieldLabel: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.copy,
    marginBottom: 5,
    fontWeight: '800'
  },
  input: {
    backgroundColor: theme.colors.bg.light,
    lineHeight: theme.fonts.sizes.large * 1.5,
    fontSize: theme.fonts.sizes.large,
    padding: 10
  },
  expectedMTNamount: {
    marginTop: 20
  },
  msg: {
    fontSize: theme.fonts.sizes.small,
    opacity: 0.6
  },
  amount: {
    fontSize: theme.fonts.sizes.normal,
    opacity: 0.8
  },
  error: {
    fontSize: theme.fonts.sizes.small,
    marginTop: 20,
    color: theme.colors.danger
  },
  btnContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
