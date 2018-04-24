import { errorPropTypes, pageStatusPropTypes } from '../../utils'
import withConvertMETtoETHState from '../../shared/hocs/withConvertMETtoETHState'
import PropTypes from 'prop-types'
import React from 'react'
import {
  ConfirmationWizard,
  DisplayValue,
  TextInput,
  GasEditor,
  BaseBtn,
  Text,
  View,
  Btn
} from '../common'

class ConvertMETtoETHForm extends React.Component {
  static propTypes = {
    gasEstimateError: PropTypes.bool,
    onWizardSubmit: PropTypes.func.isRequired,
    metPlaceholder: PropTypes.string,
    estimateError: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    availableMET: PropTypes.string.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    metAmount: PropTypes.string,
    validate: PropTypes.func.isRequired,
    gasPrice: PropTypes.string,
    gasLimit: PropTypes.string,
    estimate: PropTypes.string,
    errors: errorPropTypes('metAmount'),
    ...pageStatusPropTypes
  }

  componentDidUpdate(prevProps) {
    if (this.props.status === 'offscreen' && prevProps.status !== 'offscreen') {
      this.props.resetForm()
    }
  }

  renderConfirmation = () => {
    return (
      <Text size="large">
        You will convert{' '}
        <DisplayValue
          value={this.props.metAmount}
          color="primary"
          toWei
          post=" MET"
        />{' '}
        and get approximately{' '}
        <DisplayValue value={this.props.estimate} post=" ETH" color="primary" />.
      </Text>
    )
  }

  renderForm = ({ goToReview }) => {
    return (
      <View flex={1} px={2} py={4} justify="space-between">
        <TextInput
          placeholder={this.props.metPlaceholder}
          postLabel={
            <BaseBtn
              textProps={{ opacity: 0.75 }}
              onPress={this.props.onMaxClick}
              label="MAX"
              size="small"
            />
          }
          onChange={this.props.onInputChange}
          error={this.props.errors.metAmount}
          label="Amount (MET)"
          value={this.props.metAmount}
          id="metAmount"
        />
        <View grow={1} mt={4}>
          <GasEditor
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
                post=" ETH"
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
        pendingTitle="Converting MET..."
        pendingText="This may take a while. You can close this and follow the status of the conversion in the transaction list."
        renderForm={this.renderForm}
        editLabel="Edit this conversion"
        validate={this.props.validate}
      />
    )
  }
}

export default withConvertMETtoETHState(ConvertMETtoETHForm)
