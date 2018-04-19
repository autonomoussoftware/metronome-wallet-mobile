import { TextInput, View, Text, Btn } from './common';
import ConfirmationWizard from '../shared/ConfirmationWizard';
import PropTypes from 'prop-types';
import React from 'react';
// import RN from 'react-native';

const Form = ({ goToReview }) => (
  <View bg="dark" flex={1} p={2} justify="space-evenly">
    <TextInput onChange={() => 1} label="Amount (ETH)" id="ethAmount" />
    <Btn label="Buy" mt={2} onPress={goToReview} />
  </View>
);

Form.propTypes = {
  goToReview: PropTypes.func.isRequired
};

const Confirmation = props => {
  return (
    <View bg="dark" flex={1} p={2} justify="space-evenly">
      <TextInput
        onChange={props.onPasswordChange}
        label="Password"
        value={props.password}
        error={props.errors.password}
        id="password"
      />
      <Btn label="Buy" mt={2} onPress={props.onConfirm} />
      <Btn label="Cancel" mt={2} onPress={props.onCancel} />
    </View>
  );
};

Confirmation.propTypes = {
  onPasswordChange: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  password: PropTypes.string,
  errors: PropTypes.shape({
    password: PropTypes.string
  }).isRequired
};

const Success = () => (
  <View bg="dark" flex={1} p={2} justify="space-evenly">
    <Text>Success!</Text>
  </View>
);

const Failure = ({ error }) => (
  <View bg="dark" flex={1} p={2} justify="space-evenly">
    <Text>Error!</Text>
    <Text>{error}</Text>
  </View>
);

Failure.propTypes = {
  error: PropTypes.string.isRequired
};

const Pending = () => (
  <View bg="dark" flex={1} p={2} justify="space-evenly">
    <Text>Wait</Text>
  </View>
);

export default class BuyMETForm extends React.Component {
  static propTypes = {};

  render() {
    return (
      <ConfirmationWizard
        ConfirmationComponent={Confirmation}
        SuccessComponent={Success}
        FailureComponent={Failure}
        PendingComponent={Pending}
        onWizardSubmit
        FormComponent={Form}
        validate
      />
    );
  }
}
