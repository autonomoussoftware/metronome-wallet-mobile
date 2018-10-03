import * as selectors from '../selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

const withTxRowState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      confirmations: PropTypes.number.isRequired,
      transaction: PropTypes.shape({
        hash: PropTypes.string.isRequired
      }).isRequired,
      receipt: PropTypes.object,
      parsed: PropTypes.shape({
        mtnBoughtInAuction: PropTypes.string,
        contractCallFailed: PropTypes.bool,
        txType: PropTypes.string.isRequired
      }).isRequired,
      config: PropTypes.shape({
        MTN_TOKEN_ADDR: PropTypes.string.isRequired,
        CONVERTER_ADDR: PropTypes.string.isRequired
      }).isRequired
    }

    static displayName = `withTxRowState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    render() {
      const { parsed: tx, confirmations } = this.props

      const isFailed =
        (tx.txType === 'auction' &&
          !tx.mtnBoughtInAuction &&
          confirmations > 0) ||
        tx.contractCallFailed

      const isPending = !isFailed && confirmations < 6

      return (
        <WrappedComponent
          MTN_TOKEN_ADDR={this.props.config.MTN_TOKEN_ADDR}
          CONVERTER_ADDR={this.props.config.CONVERTER_ADDR}
          confirmations={confirmations}
          transaction={this.props.transaction}
          isPending={isPending}
          isFailed={isFailed}
          receipt={this.props.receipt}
          tx={tx}
          {...tx}
        />
      )
    }
  }

  const mapStateToProps = (state, props) => ({
    confirmations: selectors.getTxConfirmations(state, props),
    config: selectors.getConfig(state)
  })

  return connect(mapStateToProps)(Container)
}

export default withTxRowState
