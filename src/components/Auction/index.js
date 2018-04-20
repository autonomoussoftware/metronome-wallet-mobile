import { RoutePager, Text, View, Btn } from '../common'
import { pageStatusPropTypes } from '../../utils'
import withAuctionState from '../../shared/hocs/withAuctionState'
import BuyMETForm from './BuyMETForm'
import CountDown from './CountDown'
import PropTypes from 'prop-types'
import { Link } from 'react-router-native'
import Stats from './Stats'
import React from 'react'
import RN from 'react-native'

export default class Auction extends React.Component {
  render() {
    return (
      <RoutePager
        pages={{
          '/auction': withAuctionState(AuctionHome),
          '/auction/buy': BuyMETForm
        }}
      />
    )
  }
}

const AuctionHome = props => {
  const {
    countdownTargetTimestamp,
    buyDisabledReason,
    auctionPriceUSD,
    auctionStatus,
    buyDisabled,
    pageStatus,
    showStats,
    title
  } = props

  if (pageStatus === 'offscreen') return null

  return (
    <View flex={1} px={2} py={4} justify="space-between">
      {auctionStatus ? (
        <React.Fragment>
          <View>
            <Text data-testid="title" my={1} align="center">
              {title}
            </Text>
            <CountDown targetTimestamp={countdownTargetTimestamp} />
          </View>

          {showStats && (
            <React.Fragment>
              <Stats
                auctionPriceUSD={auctionPriceUSD}
                auctionStatus={auctionStatus}
              />
              <Link
                component={Btn}
                disabled={buyDisabled}
                label="Buy Metronome"
                block
                to="/auction/buy"
                mt={2}
              />
              {buyDisabledReason && (
                <Text opacity={0.8} align="center" size="small" my={1}>
                  {buyDisabledReason}
                </Text>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <View flex={1} justify="center" align="center">
          <Text size="medium" mb={2}>
            Waiting for auction status...
          </Text>
          <RN.ActivityIndicator />
        </View>
      )}
    </View>
  )
}

AuctionHome.propTypes = {
  countdownTargetTimestamp: PropTypes.number.isRequired,
  buyDisabledReason: PropTypes.string,
  auctionPriceUSD: PropTypes.string.isRequired,
  auctionStatus: PropTypes.shape({
    nextAuctionStartTime: PropTypes.number.isRequired,
    tokenRemaining: PropTypes.string.isRequired,
    currentAuction: PropTypes.string.isRequired,
    currentPrice: PropTypes.string.isRequired,
    genesisTime: PropTypes.number.isRequired
  }),
  buyDisabled: PropTypes.bool.isRequired,
  showStats: PropTypes.bool.isRequired,
  title: PropTypes.string,
  ...pageStatusPropTypes
}
