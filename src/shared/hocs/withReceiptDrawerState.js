import { withClient } from './clientContext'
// import * as selectors from '../selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

const withReceiptDrawerState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      client: PropTypes.shape({
        onExplorerLinkClick: PropTypes.func.isRequired
      }).isRequired
    }

    static displayName = `withReceiptDrawerState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    state = {}

    render() {
      return (
        <WrappedComponent
          onExplorerLinkClick={this.props.client.onExplorerLinkClick}
          {...this.props}
        />
      )
    }
  }

  const mapStateToProps = state => {
    // const tx = props.location && props.location.state
    // const confirmations = tx ? selectors.getTxConfirmations(state, tx) : 0

    return {
      // confirmations,
      // isPending: confirmations < 6
    }
  }

  return connect(mapStateToProps)(withClient(Container))
}

export default withReceiptDrawerState
