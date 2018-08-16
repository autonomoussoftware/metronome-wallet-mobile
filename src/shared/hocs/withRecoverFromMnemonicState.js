import * as validators from '../validators'
import { withClient } from './clientContext'
import * as utils from '../utils'
import PropTypes from 'prop-types'
import React from 'react'

const withRecoverFromMnemonicState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      client: PropTypes.shape({
        recoverFromMnemonic: PropTypes.func.isRequired,
        isValidMnemonic: PropTypes.func.isRequired
      }).isRequired
    }

    static displayName = `withRecoverFromMnemonicState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    state = {
      mnemonic: null,
      errors: {}
    }

    onInputChange = ({ id, value }) => {
      this.setState(state => ({
        ...state,
        [id]: value,
        errors: {
          ...state.errors,
          [id]: null
        }
      }))
    }

    onSubmit = password => {
      return this.props.client.recoverFromMnemonic({
        mnemonic: utils.sanitizeMnemonic(this.state.mnemonic),
        password
      })
    }

    validate = () => {
      const errors = {
        ...validators.validateMnemonic(this.props.client, this.state.mnemonic)
      }
      const hasErrors = Object.keys(errors).length > 0
      if (hasErrors) this.setState({ errors })
      return !hasErrors
    }

    render() {
      return (
        <WrappedComponent
          onInputChange={this.onInputChange}
          onSubmit={this.onSubmit}
          validate={this.validate}
          {...this.state}
          {...this.props}
        />
      )
    }
  }

  return withClient(Container)
}

export default withRecoverFromMnemonicState
