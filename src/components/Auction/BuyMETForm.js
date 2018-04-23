import { pageStatusPropTypes } from '../../utils'
import withBuyMETFormState from '../../shared/hocs/withBuyMETFormState'
import ConfirmationWizard from '../common/Confirmation'
import PropTypes from 'prop-types'
import React from 'react'
import {
  AmountFields,
  DisplayValue,
  GasEditor,
  View,
  Btn,
  Text
} from '../common'

class BuyMETForm extends React.Component {
  static propTypes = {
    expectedMETamount: PropTypes.string,
    excessETHAmount: PropTypes.string,
    usedETHAmount: PropTypes.string,
    excedes: PropTypes.bool,
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
    return this.props.excedes ? (
      <React.Fragment>
        <View>
          <Text size="large">
            You will use{' '}
            <DisplayValue
              value={this.props.usedETHAmount}
              color="primary"
              post=" ETH"
            />{' '}
            to buy{' '}
            <DisplayValue
              value={this.props.tokenRemaining}
              color="primary"
              post=" MET"
            />{' '}
            at current price and get a return of approximately{' '}
            <DisplayValue
              value={this.props.excessETHAmount}
              color="primary"
              post=" ETH"
            />.
          </Text>
        </View>
        <View my={2}>
          <Text color="danger" size="medium">
            This operation will deplete the current auction.
          </Text>
        </View>
      </React.Fragment>
    ) : (
      <Text size="large">
        You will use{' '}
        <DisplayValue
          value={this.props.ethAmount}
          toWei
          post=" ETH"
          color="primary"
        />{' '}
        (${this.props.usdAmount}) to buy approximately{' '}
        <DisplayValue
          value={this.props.expectedMETamount}
          post=" MET"
          color="primary"
        />{' '}
        at current price.
      </Text>
    )
  }

  renderForm = ({ goToReview }) => {
    return (
      <View bg="dark" flex={1} px={2} py={4} justify="space-between">
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

          {this.props.expectedMETamount && (
            <View mt={4}>
              {this.props.excedes ? (
                <Text color="danger" size="medium">
                  You would get all remaining{' '}
                  <DisplayValue
                    value={this.props.tokenRemaining}
                    color="danger"
                    post=" MET"
                  />{' '}
                  and receive a return of approximately{' '}
                  <DisplayValue
                    value={this.props.excessETHAmount}
                    color="danger"
                    post=" ETH"
                  />.
                </Text>
              ) : (
                <Text size="medium">
                  You would get approximately{' '}
                  <DisplayValue
                    value={this.props.expectedMETamount}
                    post=" MET"
                  />.
                </Text>
              )}
            </View>
          )}
        </View>
        <Btn label="Review Buy" mt={4} onPress={goToReview} />
      </View>
    )
  }

  render() {
    if (this.props.pageStatus === 'offscreen') return null

    return (
      <ConfirmationWizard
        renderConfirmation={this.renderConfirmation}
        onWizardSubmit={this.props.onWizardSubmit}
        pendingTitle="Buying MET..."
        renderForm={this.renderForm}
        validate={this.props.validate}
      />
    )
  }
}

export default withBuyMETFormState(BuyMETForm)
