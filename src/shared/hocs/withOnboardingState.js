import * as validators from '../validators'
import { withClient } from './clientContext'
import * as selectors from '../selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

/**
 * Returns an interpolated CSS hue value between red & green
 * based on passwordEntropy / targetEntropy ratio
 *
 *   ratio === 0 -> red
 *   ratio  <  1 -> orange
 *   ratio >=  1 -> green
 */
function getPasswordStrengthHue(ratio) {
  // Hues are adapted to match the theme's success and danger colors
  const orangeHue = 50
  const greenHue = 139
  const redHue = 11

  return ratio < 1 ? ratio * orangeHue + redHue : greenHue
}

function getPasswordStrengthMessage(ratio) {
  if (ratio > 0 && ratio < 0.75) return 'Too weak'
  if (ratio >= 0.75 && ratio < 1) return 'Almost there...'
  if (ratio >= 1 && ratio < 1.5) return 'Strong'
  if (ratio >= 1.5) return 'Very strong'
  return ''
}

const withOnboardingState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      client: PropTypes.shape({
        onOnboardingCompleted: PropTypes.func.isRequired,
        onTermsLinkClick: PropTypes.func.isRequired,
        getStringEntropy: PropTypes.func.isRequired,
        isValidMnemonic: PropTypes.func.isRequired,
        createMnemonic: PropTypes.func.isRequired
      }).isRequired,
      config: PropTypes.shape({
        REQUIRED_PASSWORD_ENTROPY: PropTypes.number.isRequired
      }).isRequired
    }

    static displayName = `withOnboardingState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    state = {
      isPasswordDefined: false,
      areTermsAccepted: false,
      isMnemonicCopied: false,
      useUserMnemonic: false,
      passwordAgain: null,
      mnemonicAgain: null,
      userMnemonic: null,
      password: null,
      mnemonic: null,
      errors: {}
    }

    componentDidMount() {
      this.props.client
        .createMnemonic()
        .then(mnemonic => this.setState({ mnemonic }))
    }

    onTermsAccepted = () => this.setState({ areTermsAccepted: true })

    onPasswordSubmit = () => {
      const { password, passwordAgain } = this.state

      const errors = validators.validatePasswordCreation(
        this.props.client,
        this.props.config,
        password
      )

      if (!errors.password && !passwordAgain) {
        errors.passwordAgain = 'Repeat the password'
      } else if (!errors.password && passwordAgain !== password) {
        errors.passwordAgain = "Passwords don't match"
      }
      if (Object.keys(errors).length > 0) return this.setState({ errors })

      this.setState({ isPasswordDefined: true })
    }

    onUseUserMnemonicToggled = () => {
      this.setState(state => ({
        ...state,
        useUserMnemonic: !state.useUserMnemonic,
        userMnemonic: null,
        errors: {
          ...state.errors,
          userMnemonic: null
        }
      }))
    }

    onMnemonicCopiedToggled = () => {
      this.setState(state => ({
        ...state,
        isMnemonicCopied: !state.isMnemonicCopied,
        mnemonicAgain: null,
        errors: {
          ...state.errors,
          mnemonicAgain: null
        }
      }))
    }

    onMnemonicAccepted = () => {
      if (this.state.useUserMnemonic) {
        const errors = validators.validateMnemonic(
          this.props.client,
          this.state.userMnemonic,
          'userMnemonic'
        )
        if (Object.keys(errors).length > 0) return this.setState({ errors })
      } else {
        if (this.state.mnemonic !== this.state.mnemonicAgain) {
          return this.setState({
            errors: {
              mnemonicAgain:
                'The text provided does not match your recovery passphrase.'
            }
          })
        }
      }
      return this.props.client.onOnboardingCompleted({
        password: this.state.password,
        mnemonic: this.state.useUserMnemonic
          ? this.state.userMnemonic
          : this.state.mnemonic
      })
    }

    onInputChange = ({ id, value }) => {
      this.setState(state => ({
        ...state,
        [id]: value,
        errors: {
          ...state.errors,
          [id]: null
        }
      }))
    }

    getCurrentStep() {
      if (!this.state.areTermsAccepted) return 'ask-for-terms'
      if (!this.state.isPasswordDefined) return 'define-password'
      if (this.state.useUserMnemonic) return 'recover-from-mnemonic'
      if (this.state.isMnemonicCopied) return 'verify-mnemonic'
      return 'copy-mnemonic'
    }

    render() {
      const passwordEntropy = this.state.password
        ? this.props.client.getStringEntropy(this.state.password)
        : 0

      const passwordStrengthRatio =
        passwordEntropy / this.props.config.REQUIRED_PASSWORD_ENTROPY

      const passwordStrengthMessage = getPasswordStrengthMessage(
        passwordStrengthRatio
      )

      const passwordStrengthHue = getPasswordStrengthHue(passwordStrengthRatio)

      return (
        <WrappedComponent
          onUseUserMnemonicToggled={this.onUseUserMnemonicToggled}
          onMnemonicCopiedToggled={this.onMnemonicCopiedToggled}
          passwordStrengthMessage={passwordStrengthMessage}
          passwordStrengthRatio={passwordStrengthRatio}
          passwordStrengthHue={passwordStrengthHue}
          onMnemonicAccepted={this.onMnemonicAccepted}
          onTermsLinkClick={this.props.client.onTermsLinkClick}
          onPasswordSubmit={this.onPasswordSubmit}
          onTermsAccepted={this.onTermsAccepted}
          onInputChange={this.onInputChange}
          currentStep={this.getCurrentStep()}
          {...this.state}
        />
      )
    }
  }

  const mapStateToProps = state => ({
    config: selectors.getConfig(state)
  })

  return connect(mapStateToProps)(withClient(Container))
}

export default withOnboardingState
