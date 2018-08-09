import { TextInput, View, Text, Btn, BaseBtn } from '../common'
import withOnboardingState from '../../shared/hocs/withOnboardingState'
import { errorPropTypes } from '../../utils'
import EntropyMeter from './EntropyMeter'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

class Onboarding extends React.Component {
  static propTypes = {
    onUseUserMnemonicToggled: PropTypes.func.isRequired,
    onMnemonicCopiedToggled: PropTypes.func.isRequired,
    passwordStrengthMessage: PropTypes.string.isRequired,
    passwordStrengthRatio: PropTypes.number.isRequired,
    passwordStrengthHue: PropTypes.number.isRequired,
    onMnemonicAccepted: PropTypes.func.isRequired,
    onPasswordSubmit: PropTypes.func.isRequired,
    onTermsLinkClick: PropTypes.func.isRequired,
    onTermsAccepted: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    passwordAgain: PropTypes.string,
    mnemonicAgain: PropTypes.string,
    userMnemonic: PropTypes.string,
    currentStep: PropTypes.oneOf([
      'recover-from-mnemonic',
      'define-password',
      'verify-mnemonic',
      'ask-for-terms',
      'copy-mnemonic'
    ]).isRequired,
    mnemonic: PropTypes.string,
    password: PropTypes.string,
    errors: errorPropTypes(
      'mnemonicAgain',
      'passwordAgain',
      'userMnemonic',
      'password'
    )
  }

  _renderTermsStep() {
    return (
      <View justify="center" flex={1}>
        <View align="center" p={2}>
          <Text size="large" mb={2}>
            Accept to Continue
          </Text>
          <Text align="center">
            By clicking “Accept”, you confirm you have read and agreed to our{' '}
            <RN.TouchableOpacity onPress={this.props.onTermsLinkClick}>
              <Text color="success" mb={-0.4}>
                software license
              </Text>
            </RN.TouchableOpacity>.
          </Text>
          <Btn
            onPress={this.props.onTermsAccepted}
            label="Accept"
            block
            my={4}
          />
        </View>
      </View>
    )
  }

  _renderPasswordStep() {
    return (
      <RN.KeyboardAvoidingView behavior="padding" style={styles.step}>
        <View align="center" p={2}>
          <Text size="large" mb={2}>
            Define a Password
          </Text>
          <Text align="center" mb={2} px={4}>
            Enter a strong password until the meter turns{' '}
            <Text color="success">green</Text>.
          </Text>
          <TextInput
            autoFocus
            onChange={this.props.onInputChange}
            error={this.props.errors.password}
            value={this.props.password}
            label="Password"
            id="password"
            noFocus
          />
          {!this.props.errors.password && (
            <EntropyMeter
              message={this.props.passwordStrengthMessage}
              ratio={this.props.passwordStrengthRatio}
              hue={this.props.passwordStrengthHue}
            />
          )}
          <TextInput
            topMargin
            onChange={this.props.onInputChange}
            error={this.props.errors.passwordAgain}
            value={this.props.passwordAgain}
            label="Repeat Password"
            id="passwordAgain"
          />
          <Btn
            onPress={this.props.onPasswordSubmit}
            label="Continue"
            block
            mt={4}
          />
        </View>
      </RN.KeyboardAvoidingView>
    )
  }

  _renderCopyMnemonicStep() {
    return (
      <View justify="center" align="center" flex={1} p={2}>
        <Text size="large" mb={2}>
          Recovery Passphrase
        </Text>
        <Text mb={4} align="center">
          Copy the following word list and keep it in a safe place. You will
          need these to recover your wallet in the future —don’t lose it.
        </Text>
        {this.props.mnemonic ? (
          <View row rowwrap justify="space-evenly">
            {this.props.mnemonic.split(' ').map(w => (
              <Text key={w} color="primary" m={1} size="large">
                {w}
              </Text>
            ))}
          </View>
        ) : (
          <RN.ActivityIndicator />
        )}
        <Btn
          onPress={this.props.onMnemonicCopiedToggled}
          label="I've copied it"
          block
          mt={6}
          mb={3}
        />
        <BaseBtn
          onPress={this.props.onUseUserMnemonicToggled}
          label="Or recover from a saved passphrase"
          block
        />
      </View>
    )
  }

  _renderVerifyMnemonicStep() {
    return (
      <RN.KeyboardAvoidingView behavior="padding" style={styles.step}>
        <View align="center" p={2}>
          <Text size="large" mb={2}>
            Recovery Passphrase
          </Text>
          <Text mb={4} align="center">
            To verify you have copied the recovery passphrase correctly, enter
            the 12 words provided before in the field below.
          </Text>
          <TextInput
            numberOfLines={3}
            multiline
            onChange={this.props.onInputChange}
            error={this.props.errors.mnemonicAgain}
            value={this.props.mnemonicAgain}
            label="Recovery passphrase"
            id="mnemonicAgain"
          />
          <Btn
            onPress={this.props.onMnemonicAccepted}
            label="Done"
            block
            mt={2}
            mb={4}
          />
          <BaseBtn
            onPress={this.props.onMnemonicCopiedToggled}
            label="Go back"
            block
          />
        </View>
      </RN.KeyboardAvoidingView>
    )
  }

  _renderUserMnemonicStep() {
    return (
      <RN.KeyboardAvoidingView behavior="padding" style={styles.step}>
        <View align="center" p={2}>
          <Text size="large" mb={2}>
            Recovery Passphrase
          </Text>
          <Text mb={4} align="center">
            Enter a valid 12 word passphrase to recover a previously created
            wallet.
          </Text>
          <TextInput
            numberOfLines={3}
            multiline
            onChange={this.props.onInputChange}
            error={this.props.errors.userMnemonic}
            value={this.props.userMnemonic}
            label="Recovery phrase"
            id="userMnemonic"
          />
          <Btn
            onPress={this.props.onMnemonicAccepted}
            label="Recover"
            block
            mt={2}
            mb={4}
          />
          <BaseBtn
            onPress={this.props.onUseUserMnemonicToggled}
            label="Go back"
            block
          />
        </View>
      </RN.KeyboardAvoidingView>
    )
  }

  render() {
    return (
      <View bg="dark" flex={1}>
        <RN.StatusBar barStyle="light-content" />
        <RN.ImageBackground
          source={require('../../assets/images/pattern.png')}
          style={styles.bg}
        >
          {this.props.currentStep === 'ask-for-terms' &&
            this._renderTermsStep()}

          {this.props.currentStep === 'define-password' &&
            this._renderPasswordStep()}

          {this.props.currentStep === 'copy-mnemonic' &&
            this._renderCopyMnemonicStep()}

          {this.props.currentStep === 'verify-mnemonic' &&
            this._renderVerifyMnemonicStep()}

          {this.props.currentStep === 'recover-from-mnemonic' &&
            this._renderUserMnemonicStep()}
        </RN.ImageBackground>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  bg: {
    flex: 1
  },
  step: {
    justifyContent: 'center',
    flex: 1
  }
})

export default withOnboardingState(Onboarding)
