import { pageStatusPropTypes } from '../../utils'
import withSendETHFormState from '../../shared/hocs/withSendETHFormState'
import PropTypes from 'prop-types'
import React from 'react'
import {
  ConfirmationWizard,
  AmountFields,
  DisplayValue,
  GasEditor,
  TextInput,
  View,
  Text,
  Btn
} from '../common'

class SendETHForm extends React.Component {
  static propTypes = {
    gasEstimateError: PropTypes.bool,
    onWizardSubmit: PropTypes.func.isRequired,
    ethPlaceholder: PropTypes.string,
    usdPlaceholder: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    availableETH: PropTypes.string.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    ethAmount: PropTypes.string,
    usdAmount: PropTypes.string,
    validate: PropTypes.func.isRequired,
    gasPrice: PropTypes.string,
    gasLimit: PropTypes.string,
    errors: PropTypes.object.isRequired,
    ...pageStatusPropTypes
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.pageStatus === 'offscreen' &&
      prevProps.pageStatus !== 'offscreen'
    ) {
      this.props.resetForm()
    }
  }

  renderConfirmation = () => {
    return (
      <Text size="large">
        You will send{' '}
        <DisplayValue
          value={this.props.ethAmount}
          color="primary"
          toWei
          post=" ETH"
        />{' '}
        (${this.props.usdAmount}) to the address{' '}
        <Text color="primary" numberOfLines={1}>
          {this.props.toAddress}
        </Text>.
      </Text>
    )
  }

  renderForm = ({ goToReview }) => {
    return (
      <View bg="dark" flex={1} px={2} pt={3} pb={4}>
        <View grow={1}>
          <TextInput
            placeholder="e.g. 0x2345678998765434567"
            onChange={this.props.onInputChange}
            error={this.props.errors.toAddress}
            label="Send to Address"
            value={this.props.toAddress}
            id="toAddress"
          />
          <View my={3}>
            <AmountFields
              ethPlaceholder={this.props.ethPlaceholder}
              usdPlaceholder={this.props.usdPlaceholder}
              onInputChange={this.props.onInputChange}
              onMaxClick={this.props.onMaxClick}
              ethAmount={this.props.ethAmount}
              usdAmount={this.props.usdAmount}
              errors={this.props.errors}
            />
          </View>
          <GasEditor
            gasEstimateError={this.props.gasEstimateError}
            onInputChange={this.props.onInputChange}
            useCustomGas={this.props.useCustomGas}
            gasLimit={this.props.gasLimit}
            gasPrice={this.props.gasPrice}
            errors={this.props.errors}
          />
        </View>
        <Btn label="Review Send" mt={3} onPress={goToReview} />
      </View>
    )
  }

  render() {
    if (this.props.pageStatus === 'offscreen') return null

    return (
      <ConfirmationWizard
        renderConfirmation={this.renderConfirmation}
        onWizardSubmit={this.props.onWizardSubmit}
        renderForm={this.renderForm}
        validate={this.props.validate}
      />
    )
  }
}

export default withSendETHFormState(SendETHForm)
