import { withClient } from './clientContext'
import PropTypes from 'prop-types'
import React from 'react'

const withReceiptDrawerState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      client: PropTypes.shape({
        copyToClipboard: PropTypes.func.isRequired,
        onExplorerLinkClick: PropTypes.func.isRequired
      }).isRequired
    }

    static displayName = `withReceiptDrawerState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    copyToClipboard = address => {
      this.props.client
        .copyToClipboard(address)
        .then(() => {})
        .catch(() => {})
    }

    render() {
      return (
        <WrappedComponent
          onExplorerLinkClick={this.props.client.onExplorerLinkClick}
          copyToClipboard={this.copyToClipboard}
          {...this.props}
        />
      )
    }
  }

  return withClient(Container)
}

export default withReceiptDrawerState
