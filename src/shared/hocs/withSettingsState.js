import { withClient } from './clientContext'
import PropTypes from 'prop-types'
import React from 'react'

const withSettingsState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      client: PropTypes.shape({
        getEthereumNetworkUrl: PropTypes.func.isRequired,
        setEthereumNetworkUrl: PropTypes.func.isRequired,
        clearCache: PropTypes.func.isRequired
      }).isRequired
    }

    static displayName = `withSettingsState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    state = {
      ethereumNetworkUrl: null,
      errors: {}
    }

    componentDidMount() {
      this.props.client
        .getEthereumNetworkUrl()
        .then(({ ethereumNetworkUrl }) => this.setState({ ethereumNetworkUrl }))
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

    onNetworkUrlSubmit = () => {
      // TODO: validate URL
      return this.props.client.setEthereumNetworkUrl({
        ethereumNetworkUrl: this.state.ethereumNetworkUrl
      })
    }

    onRescanTransactions = () => {
      return this.props.client.clearCache()
    }

    render() {
      return (
        <WrappedComponent
          onRescanTransactions={this.onRescanTransactions}
          onNetworkUrlSubmit={this.onNetworkUrlSubmit}
          onWizardSubmit={this.onWizardSubmit}
          onInputChange={this.onInputChange}
          {...this.state}
        />
      )
    }
  }

  return withClient(Container)
}

export default withSettingsState
