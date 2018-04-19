import * as selectors from '../selectors';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

const withSendDrawerState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      sendMetFeatureStatus: PropTypes.oneOf([
        'in-initial-auction',
        'transfer-disabled',
        'no-funds',
        'offline',
        'ok'
      ]).isRequired
    };

    static displayName = `withSendDrawerState(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    state = { copyBtnLabel: 'Copy to clipboard' };

    render() {
      const { sendMetFeatureStatus } = this.props;

      const sendMetDisabledReason =
        sendMetFeatureStatus === 'in-initial-auction'
          ? 'MET transactions are disabled during Initial Auction'
          : sendMetFeatureStatus === 'transfer-disabled'
            ? 'MET transactions not enabled yet'
            : sendMetFeatureStatus === 'no-funds'
              ? 'You need some MET to send'
              : sendMetFeatureStatus === 'offline'
                ? "Can't send while offline"
                : null;

      return (
        <WrappedComponent
          sendMetDisabledReason={sendMetDisabledReason}
          sendMetDisabled={sendMetFeatureStatus !== 'ok'}
          {...this.props}
        />
      );
    }
  }

  const mapStateToProps = state => ({
    sendMetFeatureStatus: selectors.sendMetFeatureStatus(state)
  });

  return connect(mapStateToProps)(Container);
};

export default withSendDrawerState;
