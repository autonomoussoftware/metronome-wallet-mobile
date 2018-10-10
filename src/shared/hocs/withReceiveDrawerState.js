import { withClient } from './clientContext'
import * as selectors from '../selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

const withReceiveDrawerState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      address: PropTypes.string.isRequired,
      client: PropTypes.shape({
        copyToClipboard: PropTypes.func.isRequired
      }).isRequired
    }

    static displayName = `withReceiveDrawerState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    state = { copyBtnLabel: 'Copy to clipboard' }

    copyToClipboard = () => {
      this.props.client
        .copyToClipboard(this.props.address)
        .then(() => this.setState({ copyBtnLabel: 'Copied to clipboard!' }))
        .catch(err => this.setState({ copyBtnLabel: err.message }))
    }

    render() {
      return (
        <WrappedComponent
          copyToClipboard={this.copyToClipboard}
          copyBtnLabel={this.state.copyBtnLabel}
          address={this.props.address}
        />
      )
    }
  }

  const mapStateToProps = state => ({
    address: selectors.getActiveAddress(state)
  })

  return connect(mapStateToProps)(withClient(Container))
}

export default withReceiveDrawerState
