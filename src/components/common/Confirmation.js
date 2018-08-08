import ConfirmationWizard from '../../shared/ConfirmationWizard'
import CheckIcon from '../icons/CheckIcon'
import CloseIcon from '../icons/CloseIcon'
import TextInput from './TextInput'
import PropTypes from 'prop-types'
import BaseBtn from './BaseBtn'
import React from 'react'
import View from './View'
import Text from './Text'
import Btn from './Btn'
import RN from 'react-native'

export default class Confirmation extends React.Component {
  static propTypes = {
    renderConfirmation: PropTypes.func.isRequired,
    confirmationTitle: PropTypes.string,
    onWizardSubmit: PropTypes.func.isRequired,
    pendingTitle: PropTypes.string,
    successTitle: PropTypes.string,
    failureTitle: PropTypes.string,
    successText: PropTypes.string,
    pendingText: PropTypes.string,
    renderForm: PropTypes.func.isRequired,
    validate: PropTypes.func
  }

  static defaultProps = {
    confirmationTitle: 'Transaction Preview',
    pendingTitle: 'Sending...',
    successTitle: 'Success!',
    failureTitle: 'Error',
    successText:
      'You can view the status of this transaction in the transaction list.'
  }

  renderConfirmation = ({
    onPasswordChange,
    onConfirm,
    password,
    onCancel,
    errors
  }) => {
    return (
      <View py={4} px={2} flex={1}>
        <View grow={1}>
          {this.props.confirmationTitle && (
            <Text size="large" mb={2} weight="semibold">
              {this.props.confirmationTitle}
            </Text>
          )}
          {this.props.renderConfirmation()}
          <TextInput
            topMargin
            onChange={({ value }) => onPasswordChange(value)}
            label="Enter your password to confirm"
            error={errors.password}
            value={password}
            id="password"
          />
        </View>
        <BaseBtn
          textProps={{ align: 'center' }}
          onPress={onCancel}
          label="Go back"
          m={4}
        />
        <Btn label="Confirm" onPress={onConfirm} />
      </View>
    )
  }

  renderPending = () => {
    return (
      <View flex={1}>
        <View grow={1} align="center" justify="center">
          <Text size="large" mt={-3} mb={2}>
            {this.props.pendingTitle}
          </Text>
          <RN.ActivityIndicator size="large" />
        </View>
        {this.props.pendingText && (
          <Text size="small" align="center" p={2} opacity={0.75}>
            {this.props.pendingText}
          </Text>
        )}
      </View>
    )
  }

  renderSuccess = () => {
    return (
      <View flex={1} align="center" justify="center">
        <CheckIcon />
        <Text size="large" mt={2}>
          {this.props.successTitle}
        </Text>
        {this.props.successText && (
          <Text align="center" p={2}>
            {this.props.successText}
          </Text>
        )}
      </View>
    )
  }

  renderFailure = ({ onTryAgain, error }) => {
    return (
      <View flex={1} align="center" justify="center">
        <CloseIcon />
        <Text size="large" mt={2}>
          {this.props.failureTitle}
        </Text>
        {error && (
          <Text align="center" px={2} mt={2}>
            {error}
          </Text>
        )}
        <BaseBtn
          onPress={onTryAgain}
          label="Try Again"
          color="primary"
          mt={2}
        />
      </View>
    )
  }

  render() {
    return (
      <ConfirmationWizard
        renderConfirmation={this.renderConfirmation}
        onWizardSubmit={this.props.onWizardSubmit}
        renderPending={this.renderPending}
        renderSuccess={this.renderSuccess}
        renderFailure={this.renderFailure}
        renderForm={this.props.renderForm}
        validate={this.props.validate}
      />
    )
  }
}
