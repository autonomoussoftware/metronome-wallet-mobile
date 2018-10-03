import * as validators from '../validators'
import { withClient } from './clientContext'
import * as utils from '../utils'
import PropTypes from 'prop-types'
import React from 'react'

const withToolsState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      client: PropTypes.shape({
        recoverFromMnemonic: PropTypes.func.isRequired,
        isValidMnemonic: PropTypes.func.isRequired,
        clearCache: PropTypes.func.isRequired
      }).isRequired
    }

    static displayName = `withToolsState(${WrappedComponent.displayName ||
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

    onSubmit = password =>
      this.props.client.recoverFromMnemonic({
        mnemonic: utils.sanitizeMnemonic(this.state.mnemonic),
        password
      })

    validate = () => {
      const errors = {
        ...validators.validateMnemonic(this.props.client, this.state.mnemonic)
      }
      const hasErrors = Object.keys(errors).length > 0
      if (hasErrors) this.setState({ errors })
      return !hasErrors
    }

    onRescanTransactions = () => this.props.client.clearCache()

    render() {
      const isRecoverEnabled =
        utils.sanitizeMnemonic(this.state.mnemonic || '').split(' ').length ===
        12

      return (
        <WrappedComponent
          onRescanTransactions={this.onRescanTransactions}
          isRecoverEnabled={isRecoverEnabled}
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

export default withToolsState
