import { TextInput, Checkbox, View, Text, Btn, BaseBtn } from '../common'
import { default as PinInput, PIN_LENGTH } from '../common/PinInput'
import withOnboardingState from '../../shared/hocs/withOnboardingState'
import TermsAndConditions from '../../shared/TermsAndConditions'
import { errorPropTypes } from '../../utils'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

const TermsText = p => <Text my={1} size="small" align="justify" {...p} />

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

  state = { licenseCheckbox: false, termsCheckbox: false }

  onCheckboxChange = ({ id, value }) => this.setState({ [id]: value })

  _renderTermsStep() {
    return (
      <View justify="center" align="center" flex={1} p={2}>
        <Text size="large" weight="semibold" mt={4}>
          Accept to Continue
        </Text>
        <Text size="medium" mt={3} align="center">
          Please read and accept these terms and permissions.
        </Text>

        <View flex={1} grow={1} mt={3} px={1} bg="translucentPrimary">
          <RN.ScrollView>
            <TermsAndConditions ParagraphComponent={TermsText} />
          </RN.ScrollView>
        </View>
        <Checkbox
          onChange={this.onCheckboxChange}
          checked={this.state.termsCheckbox}
          label="I have read and accept these terms"
          id="termsCheckbox"
          mt={4}
        />
        <Checkbox
          onChange={this.onCheckboxChange}
          checked={this.state.licenseCheckbox}
          label={
            <React.Fragment>
              I have read and accept the{' '}
              <Text
                onPress={this.props.onTermsLinkClick}
                color="success"
                mb={-0.4}
              >
                software license
              </Text>
            </React.Fragment>
          }
          id="licenseCheckbox"
          mt={1}
        />
        <Btn
          disabled={!this.state.licenseCheckbox || !this.state.termsCheckbox}
          onPress={this.props.onTermsAccepted}
          label="Continue"
          block
          mt={2}
        />
      </View>
    )
  }

  _renderPinStep() {
    return (
      <View flex={1} align="center" px={2} pt={4} justify="center">
        <Text size="large" weight="semibold" mb={2}>
          Define a PIN
        </Text>
        <RN.View style={styles.bigPlaceholder} mb={4}>
          <Text size="medium" align="center" px={4}>
            All data will be encrypted using this PIN. Don&apos;t lose it.
          </Text>
        </RN.View>
        <PinInput
          onChange={this.props.onInputChange}
          value={this.props.password || ''}
          id="password"
        />
        <View style={styles.placeholder} />
      </View>
    )
  }

  _renderVerifyPinStep() {
    return (
      <View flex={1} align="center" px={2} pt={4} justify="center">
        <Text size="large" weight="semibold" mb={2}>
          Define a PIN
        </Text>
        <View style={styles.bigPlaceholder}>
          <Text size="medium" align="center" px={4} mb={4}>
            Please, enter your PIN again.
          </Text>
        </View>
        <PinInput
          onComplete={() => this.props.onPasswordSubmit({ clearOnError: true })}
          onChange={this.props.onInputChange}
          value={this.props.passwordAgain || ''}
          error={this.props.errors.passwordAgain}
          id="passwordAgain"
        />
        <View style={styles.placeholder} justify="flex-end">
          <BaseBtn
            onPress={() => {
              this.props.onInputChange({ id: 'password', value: '' })
              this.props.onInputChange({ id: 'passwordAgain', value: '' })
            }}
            label="Go back"
            size="medium"
          />
        </View>
      </View>
    )
  }

  _renderCopyMnemonicStep() {
    return (
      <View justify="center" align="center" flex={1} p={2}>
        <Text size="large" weight="semibold" mb={2}>
          Recovery Passphrase
        </Text>
        <Text size="medium" mb={4} align="center">
          Copy the following word list and keep it in a safe place. You will
          need these to recover your wallet in the future —don’t lose it.
        </Text>
        {this.props.mnemonic ? (
          <RN.TouchableWithoutFeedback
            onPress={() => RN.Clipboard.setString(this.props.mnemonic)}
          >
            <View row rowwrap justify="space-evenly">
              {this.props.mnemonic.split(' ').map((word, i) => (
                <Text
                  weight="bold"
                  color="primary"
                  size="large"
                  key={`${word}-${i}`}
                  ls={0.5}
                  m={1}
                >
                  {word}
                </Text>
              ))}
            </View>
          </RN.TouchableWithoutFeedback>
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
          <Text size="large" weight="semibold" mb={2}>
            Recovery Passphrase
          </Text>
          <Text size="medium" mb={4} align="center">
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
          <Text size="large" weight="semibold" mb={2}>
            Recovery Passphrase
          </Text>
          <Text size="medium" mb={4} align="center">
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
            (this.props.password || '').length < PIN_LENGTH &&
            this._renderPinStep()}

          {this.props.currentStep === 'define-password' &&
            (this.props.password || '').length === PIN_LENGTH &&
            this._renderVerifyPinStep()}

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
  },
  placeholder: {
    height: 50
  },
  bigPlaceholder: {
    height: 70
  }
})

export default withOnboardingState(Onboarding)
