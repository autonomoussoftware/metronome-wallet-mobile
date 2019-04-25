import withOnboardingState from 'metronome-wallet-ui-logic/src/hocs/withOnboardingState'
import PropTypes from 'prop-types'
import React from 'react'

import VerifyMnemonicStep from './VerifyMnemonicStep'
import CopyMnemonicStep from './CopyMnemonicStep'
import UserMnemonicStep from './UserMnemonicStep'
import { PIN_LENGTH } from '../common/PinInput'
import VerifyPinStep from './VerifyPinStep'
import PatternView from '../common/PatternView'
import TermsStep from './TermsStep'
import PinStep from './PinStep'

class Onboarding extends React.Component {
  static propTypes = {
    currentStep: PropTypes.oneOf([
      'recover-from-mnemonic',
      'define-password',
      'verify-mnemonic',
      'ask-for-terms',
      'copy-mnemonic'
    ]).isRequired,
    password: PropTypes.string
  }

  render() {
    const hasPin = (this.props.password || '').length >= PIN_LENGTH

    return (
      <PatternView bg="dark" flex={1}>
        {this.props.currentStep === 'ask-for-terms' && (
          <TermsStep {...this.props} />
        )}

        {this.props.currentStep === 'define-password' && !hasPin && (
          <PinStep {...this.props} />
        )}

        {this.props.currentStep === 'define-password' && hasPin && (
          <VerifyPinStep {...this.props} />
        )}

        {this.props.currentStep === 'copy-mnemonic' && (
          <CopyMnemonicStep {...this.props} />
        )}

        {this.props.currentStep === 'verify-mnemonic' && (
          <VerifyMnemonicStep {...this.props} />
        )}

        {this.props.currentStep === 'recover-from-mnemonic' && (
          <UserMnemonicStep {...this.props} />
        )}
      </PatternView>
    )
  }
}

export default withOnboardingState(Onboarding)
