import { withClient } from './clientContext'
import * as selectors from '../selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

const withSendDrawerState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      sendMetFeatureStatus: PropTypes.oneOf(['no-funds', 'offline', 'ok'])
        .isRequired,
      client: PropTypes.shape({
        toBN: PropTypes.func.isRequired
      }).isRequired
    }

    static displayName = `withSendDrawerState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    state = { copyBtnLabel: 'Copy to clipboard' }

    render() {
      const { sendMetFeatureStatus } = this.props

      const sendMetDisabledReason =
        sendMetFeatureStatus === 'no-funds'
          ? 'You need some MET to send'
          : sendMetFeatureStatus === 'offline'
            ? "Can't send while offline"
            : null

      return (
        <WrappedComponent
          sendMetDisabledReason={sendMetDisabledReason}
          sendMetDisabled={sendMetFeatureStatus !== 'ok'}
          {...this.props}
        />
      )
    }
  }

  const mapStateToProps = (state, { client }) => ({
    sendMetFeatureStatus: selectors.sendMetFeatureStatus(state, client)
  })

  return withClient(connect(mapStateToProps)(Container))
}

export default withSendDrawerState
