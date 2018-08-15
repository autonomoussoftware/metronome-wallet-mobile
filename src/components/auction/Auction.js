import { Text, View, Btn } from '../common'
import withAuctionState from '../../shared/hocs/withAuctionState'
import CountDown from './CountDown'
import PropTypes from 'prop-types'
import Stats from './Stats'
import React from 'react'
import RN from 'react-native'

const Auction = props => {
  const {
    countdownTargetTimestamp,
    buyDisabledReason,
    auctionPriceUSD,
    auctionStatus,
    buyDisabled,
    navigation,
    showStats,
    title
  } = props

  return (
    <View bg="dark" flex={1} px={2} py={4} justify="space-between">
      {auctionStatus ? (
        <React.Fragment>
          <View>
            <Text my={1} align="center" size="medium" weight="semibold" shadow>
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
              <Btn
                disabled={buyDisabled}
                label="Buy Metronome"
                block
                onPress={() => navigation.navigate('BuyDrawer')}
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

Auction.propTypes = {
  countdownTargetTimestamp: PropTypes.number.isRequired,
  buyDisabledReason: PropTypes.string,
  auctionPriceUSD: PropTypes.string.isRequired,
  auctionStatus: PropTypes.shape({
    nextAuctionStartTime: PropTypes.number.isRequired,
    tokenRemaining: PropTypes.string.isRequired,
    currentAuction: PropTypes.number.isRequired,
    currentPrice: PropTypes.string.isRequired,
    genesisTime: PropTypes.number.isRequired
  }),
  buyDisabled: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired,
  showStats: PropTypes.bool.isRequired,
  title: PropTypes.string
}

export default withAuctionState(Auction)
