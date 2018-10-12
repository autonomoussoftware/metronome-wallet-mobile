import { withClient } from './clientContext'
import * as selectors from '../selectors'
import { connect } from 'react-redux'
import * as utils from '../utils'
import PropTypes from 'prop-types'
import React from 'react'

const withReceiptState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      confirmations: PropTypes.number.isRequired,
      address: PropTypes.string.isRequired,
      client: PropTypes.shape({
        onExplorerLinkClick: PropTypes.func.isRequired,
        refreshTransaction: PropTypes.func.isRequired,
        copyToClipboard: PropTypes.func.isRequired
      }).isRequired,
      hash: PropTypes.string.isRequired,
      tx: PropTypes.object.isRequired
    }

    static displayName = `withReceiptState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    state = {
      refreshStatus: 'init',
      refreshError: null
    }

    copyToClipboard = address => {
      this.props.client
        .copyToClipboard(address)
        .then(() => {})
        .catch(() => {})
    }

    onRefreshRequest = () => {
      this.setState({ refreshStatus: 'pending', refreshError: null })
      this.props.client
        .refreshTransaction(this.props.hash, this.props.address)
        .then(() => this.setState({ refreshStatus: 'success' }))
        .catch(() =>
          this.setState({
            refreshStatus: 'failure',
            refreshError: 'Could not refresh'
          })
        )
    }

    render() {
      return (
        <WrappedComponent
          onExplorerLinkClick={this.props.client.onExplorerLinkClick}
          onRefreshRequest={this.onRefreshRequest}
          copyToClipboard={this.copyToClipboard}
          isPending={utils.isPending(this.props.tx, this.props.confirmations)}
          isFailed={utils.isFailed(this.props.tx, this.props.confirmations)}
          {...this.props}
          {...this.state}
        />
      )
    }
  }

  const mapStateToProps = (state, { hash }) => {
    const tx = selectors.getTransactionFromHash(state, { hash })

    return {
      confirmations: selectors.getTxConfirmations(state, { tx }),
      address: selectors.getActiveAddress(state),
      tx
    }
  }

  return withClient(connect(mapStateToProps)(Container))
}

export default withReceiptState
