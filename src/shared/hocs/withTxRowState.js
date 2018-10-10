import * as selectors from '../selectors'
import { connect } from 'react-redux'
import * as utils from '../utils'
import PropTypes from 'prop-types'
import React from 'react'

const withTxRowState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      confirmations: PropTypes.number.isRequired,
      config: PropTypes.shape({
        MTN_TOKEN_ADDR: PropTypes.string.isRequired,
        CONVERTER_ADDR: PropTypes.string.isRequired
      }).isRequired,
      tx: PropTypes.shape({
        mtnBoughtInAuction: PropTypes.string,
        contractCallFailed: PropTypes.bool,
        txType: PropTypes.string.isRequired
      }).isRequired
    }

    static displayName = `withTxRowState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    render() {
      const { tx, confirmations, config } = this.props

      return (
        <WrappedComponent
          MTN_TOKEN_ADDR={config.MTN_TOKEN_ADDR}
          CONVERTER_ADDR={config.CONVERTER_ADDR}
          confirmations={confirmations}
          isPending={utils.isPending(tx, confirmations)}
          isFailed={utils.isFailed(tx, confirmations)}
          {...tx}
        />
      )
    }
  }

  const mapStateToProps = (state, props) => ({
    // avoid unnecessary re-renders once transaction is confirmed
    confirmations: Math.min(6, selectors.getTxConfirmations(state, props)),
    config: selectors.getConfig(state)
  })

  return connect(mapStateToProps)(Container)
}

export default withTxRowState
