import withConvertETHtoMETState from '../../shared/hocs/withConvertETHtoMETState'
import { pageStatusPropTypes } from '../../utils'
import PropTypes from 'prop-types'
import React from 'react'
import {
  ConfirmationWizard,
  AmountFields,
  DisplayValue,
  GasEditor,
  Text,
  Btn,
  View
} from '../common'

class ConvertETHtoMETForm extends React.Component {
  static propTypes = {
    gasEstimateError: PropTypes.bool,
    onWizardSubmit: PropTypes.func.isRequired,
    ethPlaceholder: PropTypes.string,
    usdPlaceholder: PropTypes.string,
    estimateError: PropTypes.string,
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
    estimate: PropTypes.string,
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
      <Text size="medium">
        You will convert{' '}
        <DisplayValue
          value={this.props.ethAmount}
          color="primary"
          toWei
          post=" ETH"
        />{' '}
        (${this.props.usdAmount}) and get approximately{' '}
        <DisplayValue value={this.props.estimate} post=" MTN" color="primary" />.
      </Text>
    )
  }

  renderForm = ({ goToReview }) => {
    return (
      <View flex={1} px={2} py={4} justify="space-between">
        <AmountFields
          ethPlaceholder={this.props.ethPlaceholder}
          usdPlaceholder={this.props.usdPlaceholder}
          onInputChange={this.props.onInputChange}
          onMaxClick={this.props.onMaxClick}
          ethAmount={this.props.ethAmount}
          usdAmount={this.props.usdAmount}
          errors={this.props.errors}
        />
        <View grow={1} mt={4}>
          <GasEditor
            gasEstimateError={this.props.gasEstimateError}
            onInputChange={this.props.onInputChange}
            useCustomGas={this.props.useCustomGas}
            gasLimit={this.props.gasLimit}
            gasPrice={this.props.gasPrice}
            errors={this.props.errors}
          />
          {this.props.estimate && (
            <Text size="medium" mt={4}>
              You would get approximately{' '}
              <DisplayValue
                value={this.props.estimate}
                color="primary"
                post=" MET"
              />.
            </Text>
          )}
          {this.props.estimateError && (
            <Text color="danger" mt={1}>
              Error getting conversion estimate: {this.props.estimateError}
            </Text>
          )}
        </View>
        <Btn label="Review Convert" mt={4} onPress={goToReview} />
      </View>
    )
  }

  render() {
    if (this.props.pageStatus === 'offscreen') return null

    return (
      <ConfirmationWizard
        renderConfirmation={this.renderConfirmation}
        onWizardSubmit={this.props.onWizardSubmit}
        pendingTitle="Converting ETH..."
        renderForm={this.renderForm}
        editLabel="Edit this conversion"
        validate={this.props.validate}
      />
    )
  }
}

export default withConvertETHtoMETState(ConvertETHtoMETForm)
