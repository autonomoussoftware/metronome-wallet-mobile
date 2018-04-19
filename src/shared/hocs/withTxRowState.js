import * as selectors from '../selectors';
import { withClient } from './clientContext';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

const withTxRowState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      confirmations: PropTypes.number.isRequired,
      parsed: PropTypes.shape({
        mtnBoughtInAuction: PropTypes.string,
        contractCallFailed: PropTypes.bool,
        txType: PropTypes.string.isRequired
      }).isRequired,
      client: PropTypes.shape({
        config: PropTypes.shape({
          MTN_TOKEN_ADDR: PropTypes.string.isRequired,
          CONVERTER_ADDR: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    };

    static displayName = `withTxRowState(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    render() {
      const { parsed: tx, confirmations } = this.props;

      const isFailed =
        (tx.txType === 'auction' &&
          !tx.mtnBoughtInAuction &&
          confirmations > 0) ||
        tx.contractCallFailed;

      const isPending = !isFailed && confirmations < 6;

      return (
        <WrappedComponent
          confirmations={confirmations}
          isPending={isPending}
          isFailed={isFailed}
          MTN_TOKEN_ADDR={this.props.client.config.MTN_TOKEN_ADDR}
          CONVERTER_ADDR={this.props.client.config.CONVERTER_ADDR}
          {...tx}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => ({
    confirmations: selectors.getTxConfirmations(state, props)
  });

  return connect(mapStateToProps)(withClient(Container));
};

export default withTxRowState;
