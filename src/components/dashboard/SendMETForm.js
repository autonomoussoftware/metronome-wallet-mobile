import { pageStatusPropTypes } from '../../utils'
import withSendMETFormState from '../../shared/hocs/withSendMETFormState'
import QRScanner from './QRScanner'
import PropTypes from 'prop-types'
import React from 'react'
import {
  ConfirmationWizard,
  DisplayValue,
  GasEditor,
  TextInput,
  BaseBtn,
  Text,
  View,
  Btn
} from '../common'

class SendMETForm extends React.Component {
  static propTypes = {
    gasEstimateError: PropTypes.bool,
    onWizardSubmit: PropTypes.func.isRequired,
    metPlaceholder: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    availableMET: PropTypes.string.isRequired,
    useCustomGas: PropTypes.bool.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    metAmount: PropTypes.string,
    validate: PropTypes.func.isRequired,
    gasPrice: PropTypes.string,
    gasLimit: PropTypes.string,
    errors: PropTypes.object.isRequired,
    ...pageStatusPropTypes
  }

  state = { showQRscanner: false }

  onCloseScanQRClick = () => this.setState({ showQRscanner: false })

  onScanQRClick = () => this.setState({ showQRscanner: true })

  onQRcodeRead = e => {
    this.props.onInputChange({ id: 'toAddress', value: e.data })
    this.setState({ showQRscanner: false })
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
        You will send{' '}
        <DisplayValue
          value={this.props.metAmount}
          color="primary"
          toWei
          post=" MET"
        />{' '}
        to the address{' '}
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
            postLabel={
              <BaseBtn
                textProps={{ opacity: 0.8, weight: 'semibold' }}
                onPress={this.onScanQRClick}
                label="SCAN QR"
                size="xSmall"
              />
            }
            onChange={this.props.onInputChange}
            error={this.props.errors.toAddress}
            label="Send to Address"
            value={this.props.toAddress}
            id="toAddress"
          />
          <View my={3}>
            <TextInput
              placeholder={this.props.metPlaceholder}
              postLabel={
                <BaseBtn
                  textProps={{ opacity: 0.8, weight: 'semibold' }}
                  onPress={this.props.onMaxClick}
                  label="MAX"
                  size="xSmall"
                />
              }
              onChange={this.props.onInputChange}
              error={this.props.errors.metAmount}
              label="Amount (MET)"
              value={this.props.metAmount}
              id="metAmount"
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
      <React.Fragment>
        <ConfirmationWizard
          renderConfirmation={this.renderConfirmation}
          onWizardSubmit={this.props.onWizardSubmit}
          renderForm={this.renderForm}
          validate={this.props.validate}
        />
        {this.state.showQRscanner && (
          <QRScanner
            onClose={this.onCloseScanQRClick}
            onRead={this.onQRcodeRead}
          />
        )}
      </React.Fragment>
    )
  }
}

export default withSendMETFormState(SendMETForm)
