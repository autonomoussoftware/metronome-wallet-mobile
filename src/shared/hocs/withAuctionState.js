import * as selectors from '../selectors';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

const withAuctionState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      buyFeatureStatus: PropTypes.oneOf(['offline', 'depleted', 'ok'])
        .isRequired,
      auctionStatus: PropTypes.shape({
        nextAuctionStartTime: PropTypes.number.isRequired,
        tokenRemaining: PropTypes.string.isRequired,
        currentAuction: PropTypes.string.isRequired,
        currentPrice: PropTypes.string.isRequired,
        genesisTime: PropTypes.number.isRequired
      })
    };

    static displayName = `withAuctionState(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    render() {
      const { auctionStatus, buyFeatureStatus } = this.props;

      const initialAuctionNotStarted =
        auctionStatus && auctionStatus.genesisTime * 1000 > Date.now();

      const initialAuctionEndTime =
        auctionStatus && auctionStatus.genesisTime + 7 * 24 * 60 * 60;

      const isInitialAuction =
        auctionStatus &&
        auctionStatus.currentAuction === '0' &&
        !initialAuctionNotStarted &&
        initialAuctionEndTime * 1000 > Date.now();

      const dailyAuctionsNotStarted =
        auctionStatus && parseInt(auctionStatus.currentAuction, 10) < 1;

      const title = initialAuctionNotStarted
        ? 'Initial Auction starts in'
        : isInitialAuction
          ? 'Time Remaining in Initial Auction'
          : dailyAuctionsNotStarted
            ? 'Initial Auction ended'
            : 'Time Remaining in Daily Auction';

      const countdownTargetTimestamp = initialAuctionNotStarted
        ? auctionStatus.genesisTime
        : isInitialAuction || dailyAuctionsNotStarted
          ? initialAuctionEndTime
          : auctionStatus.nextAuctionStartTime;

      const buyDisabledReason =
        buyFeatureStatus === 'offline'
          ? "Can't buy while offline"
          : buyFeatureStatus === 'depleted'
            ? 'No MET remaining in current auction'
            : null;

      return (
        <WrappedComponent
          countdownTargetTimestamp={countdownTargetTimestamp}
          buyDisabledReason={buyDisabledReason}
          buyDisabled={buyFeatureStatus !== 'ok'}
          showStats={isInitialAuction || !dailyAuctionsNotStarted}
          title={title}
          {...this.props}
        />
      );
    }
  }

  const mapStateToProps = state => ({
    buyFeatureStatus: selectors.buyFeatureStatus(state),
    auctionPriceUSD: selectors.getAuctionPriceUSD(state),
    auctionStatus: selectors.getAuctionStatus(state)
  });

  return connect(mapStateToProps)(Container);
};

export default withAuctionState;
