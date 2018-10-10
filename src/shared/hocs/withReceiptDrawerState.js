import { withClient } from './clientContext'
import * as selectors from '../selectors'
import { connect } from 'react-redux'
import * as utils from '../utils'
import PropTypes from 'prop-types'
import React from 'react'

const withReceiptDrawerState = hashGetter => WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      confirmations: PropTypes.number.isRequired,
      address: PropTypes.string.isRequired,
      client: PropTypes.shape({
        onExplorerLinkClick: PropTypes.func.isRequired,
        refreshTransaction: PropTypes.func.isRequired,
        copyToClipboard: PropTypes.func.isRequired
      }).isRequired,
      tx: PropTypes.shape({
        hash: PropTypes.string.isRequired
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

    onRefreshClick = () => {
      this.setState({ refreshStatus: 'pending', refreshError: null })
      this.props.client
        .refreshTransaction(this.props.tx.hash, this.props.address)
        .then(() => this.setState({ refreshStatus: 'success' }))
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
          isPending={utils.isPending(this.props.tx, this.props.confirmations)}
          isFailed={utils.isFailed(this.props.tx, this.props.confirmations)}
          {...this.props}
          {...this.state}
        />
      )
    }
  }

  const mapStateToProps = (state, props) => {
    const selectedHash = hashGetter(props)
    const items = selectors.getActiveWalletTransactions(state)
    const tx = items.find(({ hash }) => hash === selectedHash)

    return {
      confirmations: selectors.getTxConfirmations(state, { tx }),
      address: selectors.getActiveAddress(state),
      tx
    }
  }

  return withClient(connect(mapStateToProps)(Container))
}

export default withReceiptDrawerState
