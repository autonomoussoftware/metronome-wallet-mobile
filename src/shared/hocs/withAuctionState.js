import { withClient } from './clientContext'
import * as selectors from '../selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

const withAuctionState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      buyFeatureStatus: PropTypes.oneOf(['offline', 'depleted', 'ok'])
        .isRequired,
      auctionStatus: PropTypes.shape({
        nextAuctionStartTime: PropTypes.number.isRequired,
        tokenRemaining: PropTypes.string.isRequired,
        currentAuction: PropTypes.number.isRequired,
        currentPrice: PropTypes.string.isRequired,
        genesisTime: PropTypes.number.isRequired
      }),
      client: PropTypes.shape({
        fromWei: PropTypes.func.isRequired
      }).isRequired
    }

    static displayName = `withAuctionState(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    render() {
      const { auctionStatus, buyFeatureStatus } = this.props

      const title = 'Time Remaining in Daily Auction'

      const countdownTargetTimestamp =
        auctionStatus && auctionStatus.nextAuctionStartTime

      const buyDisabledReason =
        buyFeatureStatus === 'offline'
          ? "Can't buy while offline"
          : buyFeatureStatus === 'depleted'
            ? 'No MET remaining in current auction'
            : null

      return (
        <WrappedComponent
          countdownTargetTimestamp={countdownTargetTimestamp}
          buyDisabledReason={buyDisabledReason}
          buyDisabled={buyFeatureStatus !== 'ok'}
          title={title}
          {...this.props}
        />
      )
    }
  }

  const mapStateToProps = (state, { client }) => ({
    buyFeatureStatus: selectors.buyFeatureStatus(state),
    auctionPriceUSD: selectors.getAuctionPriceUSD(state, client),
    auctionStatus: selectors.getAuctionStatus(state)
  })

  return withClient(connect(mapStateToProps)(Container))
}

export default withAuctionState
