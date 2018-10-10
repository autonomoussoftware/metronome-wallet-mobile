import { withClient } from './clientContext'
import * as selectors from '../selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

const withReceiptDrawerState = hashGetter => WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      address: PropTypes.string.isRequired,
      client: PropTypes.shape({
        onExplorerLinkClick: PropTypes.func.isRequired,
        refreshTransaction: PropTypes.func.isRequired,
        copyToClipboard: PropTypes.func.isRequired
      }).isRequired
    }

    static displayName = `withReceiptDrawerState(${WrappedComponent.displayName ||
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

    onRefreshClick = hash => {
      this.setState({ refreshStatus: 'pending', refreshError: null })
      this.props.client
        .refreshTransaction(hash, this.props.address)
        .then(() => {
          setTimeout(() => this.setState({ refreshStatus: 'success' }), 1500)
        })
        .catch(err =>
          this.setState({ refreshStatus: 'failure', refreshError: err.message })
        )
    }

    render() {
      return (
        <WrappedComponent
          onExplorerLinkClick={this.props.client.onExplorerLinkClick}
          copyToClipboard={this.copyToClipboard}
          onRefreshClick={this.onRefreshClick}
          tx={this.props.tx}
          {...this.props}
          {...this.state}
        />
      )
    }
  }

  const mapStateToProps = (state, props) => {
    const selectedHash = hashGetter(props)
    const items = selectors.getActiveWalletTransactions(state)
    return {
      address: selectors.getActiveAddress(state),
      tx: items.find(tx => tx.hash === selectedHash)
    }
  }

  return withClient(connect(mapStateToProps)(Container))
}

export default withReceiptDrawerState
