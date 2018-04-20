import { View, Text, TextInput, Btn } from './common'
import withRecoverFromMnemonicState from '../shared/hocs/withRecoverFromMnemonicState'
import ConfirmationWizard from './common/Confirmation'
import PropTypes from 'prop-types'
import React from 'react'

class Tools extends React.Component {
  static propTypes = {
    onWizardSubmit: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    mnemonic: PropTypes.string,
    errors: PropTypes.shape({
      mnemonic: PropTypes.string
    }).isRequired
  }

  renderForm = ({ goToReview }) => {
    return (
      <View flex={1} py={4} px={2}>
        <View grow={1}>
          <Text>Enter the 12 words to recover your wallet.</Text>
          <Text my={4} color="danger">
            This action will replace your current stored seed!
          </Text>
          <TextInput
            numberOfLines={3}
            multiline
            onChange={this.props.onInputChange}
            error={this.props.errors.mnemonic}
            value={this.props.mnemonic}
            label="Recovery passphrase"
            id="mnemonic"
          />
        </View>
        <Btn onPress={goToReview} label="Recover" block mt={2} />
      </View>
    )
  }

  renderConfirmation = () => {
    return (
      <View>
        <Text size="large">Are you sure?</Text>
        <Text mt={2} mb={4}>
          This operation will overwrite and restart the current wallet!
        </Text>
      </View>
    )
  }

  render() {
    return (
      <ConfirmationWizard
        renderConfirmation={this.renderConfirmation}
        onWizardSubmit={this.props.onWizardSubmit}
        confirmationTitle=""
        pendingTitle="Recovering..."
        successText="Wallet successfully recovered"
        renderForm={this.renderForm}
        validate={this.props.validate}
      />
    )
  }
}

export default withRecoverFromMnemonicState(Tools)
