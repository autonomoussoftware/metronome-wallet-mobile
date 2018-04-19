import { AmountFields, GasEditor, View, Btn, Text } from '../common';
import { pageStatusPropTypes } from '../../utils';
import withBuyMETFormState from '../../shared/hocs/withBuyMETFormState';
import ConfirmationWizard from '../common/Confirmation';
import PropTypes from 'prop-types';
import React from 'react';

class BuyMETForm extends React.Component {
  static propTypes = {
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
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.pageStatus === 'offscreen' &&
      prevProps.pageStatus !== 'offscreen'
    ) {
      this.props.resetForm();
    }
  }

  renderConfirmation = () => {
    return (
      <View>
        <Text>The preview will go here</Text>
      </View>
    );
  };

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
            onInputChange={this.props.onInputChange}
            useCustomGas={this.props.useCustomGas}
            gasLimit={this.props.gasLimit}
            gasPrice={this.props.gasPrice}
            errors={this.props.errors}
          />
        </View>
        <Btn label="Review Buy" mt={4} onPress={goToReview} />
      </View>
    );
  };

  render() {
    if (this.props.pageStatus === 'offscreen') return null;

    return (
      <ConfirmationWizard
        renderConfirmation={this.renderConfirmation}
        onWizardSubmit={this.props.onWizardSubmit}
        pendingTitle="Buying MET..."
        renderForm={this.renderForm}
        validate={this.props.validate}
      />
    );
  }
}

export default withBuyMETFormState(BuyMETForm);
