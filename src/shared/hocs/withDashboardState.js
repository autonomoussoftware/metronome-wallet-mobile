import * as selectors from '../selectors';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

const withDashboardState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      sendFeatureStatus: PropTypes.oneOf(['offline', 'no-funds', 'ok'])
        .isRequired
    };

    static displayName = `withDashboardState(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    render() {
      const { sendFeatureStatus } = this.props;

      const sendDisabledReason =
        sendFeatureStatus === 'offline'
          ? "Can't send while offline"
          : sendFeatureStatus === 'no-funds'
            ? 'You need some funds to send'
            : null;

      return (
        <WrappedComponent
          sendDisabledReason={sendDisabledReason}
          sendDisabled={sendFeatureStatus !== 'ok'}
          {...this.props}
        />
      );
    }
  }

  const mapStateToProps = state => ({
    sendFeatureStatus: selectors.sendFeatureStatus(state),
    hasTransactions: selectors.getActiveWalletTransactions(state).length > 0
  });

  return connect(mapStateToProps)(Container);
};

export default withDashboardState;
