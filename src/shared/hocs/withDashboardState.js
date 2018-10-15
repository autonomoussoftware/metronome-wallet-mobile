import { withClient } from './clientContext'
import * as selectors from '../selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

const withDashboardState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      sendFeatureStatus: PropTypes.oneOf(['offline', 'no-funds', 'ok'])
        .isRequired,
      isScanningTx: PropTypes.bool.isRequired,
      address: PropTypes.string.isRequired,
      client: PropTypes.shape({
        refreshAllTransactions: PropTypes.func.isRequired
      }).isRequired
    }

    static displayName = `withDashboardState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    state = {
      refreshStatus: 'init',
      refreshError: null
    }

    onWalletRefresh = () => {
      this.setState({ refreshStatus: 'pending', refreshError: null })
      this.props.client
        .refreshAllTransactions(this.props.address)
        .then(() => this.setState({ refreshStatus: 'success' }))
        .catch(() =>
          this.setState({
            refreshStatus: 'failure',
            refreshError: 'Could not refresh'
          })
        )
    }

    render() {
      const { sendFeatureStatus } = this.props

      const sendDisabledReason =
        sendFeatureStatus === 'offline'
          ? "Can't send while offline"
          : sendFeatureStatus === 'no-funds'
            ? 'You need some funds to send'
            : null

      return (
        <WrappedComponent
          sendDisabledReason={sendDisabledReason}
          onWalletRefresh={this.onWalletRefresh}
          sendDisabled={sendFeatureStatus !== 'ok'}
          {...this.props}
          {...this.state}
        />
      )
    }
  }

  const mapStateToProps = state => ({
    sendFeatureStatus: selectors.sendFeatureStatus(state),
    hasTransactions: selectors.hasTransactions(state),
    isScanningTx: selectors.getIsScanningTx(state),
    address: selectors.getActiveAddress(state)
  })

  return withClient(connect(mapStateToProps)(Container))
}

export default withDashboardState
