import withAuctionState from 'metronome-wallet-ui-logic/src/hocs/withAuctionState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { MenuBtn, Text, View, Btn } from '../common'
import CountDown from './CountDown'
import Stats from './Stats'

const Auction = props => {
  const {
    countdownTargetTimestamp,
    buyDisabledReason,
    auctionPriceUSD,
    auctionStatus,
    buyDisabled,
    navigation,
    title
  } = props

  return (
    <View bg="dark" flex={1} px={2} py={4}>
      {auctionStatus ? (
        <React.Fragment>
          <View grow={1}>
            <Text my={1} align="center" size="medium" weight="semibold" shadow>
              {title}
            </Text>
            <CountDown targetTimestamp={countdownTargetTimestamp} />
            <View mt={4}>
              <Stats
                auctionPriceUSD={auctionPriceUSD}
                auctionStatus={auctionStatus}
              />
            </View>
          </View>
          <View mt={2}>
            {buyDisabledReason && (
              <Text opacity={0.8} align="center" size="small" mb={2}>
                {buyDisabledReason}
              </Text>
            )}
            <Btn
              disabled={buyDisabled}
              onPress={() => navigation.navigate('BuyDrawer')}
              label="Buy Metronome"
              block
            />
          </View>
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
  countdownTargetTimestamp: PropTypes.number,
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
  title: PropTypes.string
}

const EnhancedComponent = withAuctionState(Auction)

EnhancedComponent.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Auction',
  headerBackTitle: null,
  headerLeft: <MenuBtn onPress={navigation.openDrawer} />
})

export default EnhancedComponent
