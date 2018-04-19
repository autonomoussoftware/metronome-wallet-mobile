import { validatePassword } from './validators';
import PropTypes from 'prop-types';
import React from 'react';

export default class ConfirmationWizard extends React.Component {
  static propTypes = {
    renderConfirmation: PropTypes.func.isRequired,
    onWizardSubmit: PropTypes.func.isRequired,
    renderFailure: PropTypes.func.isRequired,
    renderSuccess: PropTypes.func.isRequired,
    renderPending: PropTypes.func.isRequired,
    renderForm: PropTypes.func.isRequired,
    validate: PropTypes.func
  };

  static initialState = {
    password: null,
    errors: {},
    status: 'init', // init | confirm | pending | success | failure
    result: null,
    error: null
  };

  state = ConfirmationWizard.initialState;

  goToReview = () => {
    // ev.preventDefault();
    const isValid = !this.props.validate || this.props.validate();
    if (isValid) this.setState({ status: 'confirm', password: null });
  };

  onCancelClick = () => this.setState(ConfirmationWizard.initialState);

  onConfirmClick = () => {
    // ev.preventDefault();
    if (!this.validateConfirmation()) return;
    this.setState({ status: 'pending' });
    this.props
      .onWizardSubmit(this.state.password)
      .then(result => this.setState({ status: 'success', result }))
      .catch(err => this.setState({ status: 'failure', error: err.message }));
  };

  validateConfirmation = () => {
    const errors = validatePassword(this.state.password);
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) this.setState({ errors });
    return !hasErrors;
  };

  onPasswordChange = newValue => {
    this.setState({ password: newValue });
  };

  render() {
    if (this.state.status === 'init') {
      return this.props.renderForm({ goToReview: this.goToReview });
    }

    if (this.state.status === 'confirm') {
      return this.props.renderConfirmation({
        onPasswordChange: this.onPasswordChange,
        onConfirm: this.onConfirmClick,
        onCancel: this.onCancelClick,
        password: this.state.password,
        errors: this.state.errors
      });
    }

    if (this.state.status === 'success') {
      return this.props.renderSuccess({ result: this.state.result });
    }

    if (this.state.status === 'failure') {
      return this.props.renderFailure({
        onTryAgain: this.onCancelClick,
        error: this.state.error
      });
    }

    return this.props.renderPending();
  }
}
