import PropTypes from 'prop-types'
import React from 'react'

import { DisplayValue, Confirmation, View, Text } from '../common'

class ConfirmPurchase extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          expectedMETamount: PropTypes.string,
          excessETHAmount: PropTypes.string,
          usedETHAmount: PropTypes.string,
          ethAmount: PropTypes.string,
          usdAmount: PropTypes.string,
          onSubmit: PropTypes.func.isRequired,
          excedes: PropTypes.bool
        }).isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const {
      expectedMETamount,
      excessETHAmount,
      usedETHAmount,
      ethAmount,
      usdAmount,
      onSubmit,
      excedes
    } = this.props.navigation.state.params

    return (
      <Confirmation onSubmit={onSubmit}>
        {excedes ? (
          <React.Fragment>
            <View>
              <Text size="medium">
                You will use{' '}
                <DisplayValue
                  value={usedETHAmount}
                  color="primary"
                  post=" ETH"
                />{' '}
                to buy{' '}
                <DisplayValue
                  value={expectedMETamount}
                  color="primary"
                  post=" MET"
                />{' '}
                at current price and get a return of approximately{' '}
                <DisplayValue
                  value={excessETHAmount}
                  color="primary"
                  post=" ETH"
                />
                .
              </Text>
            </View>
            <View my={2}>
              <Text color="danger" size="medium">
                This operation will deplete the current auction.
              </Text>
            </View>
          </React.Fragment>
        ) : (
          <Text size="medium">
            You will use{' '}
            <DisplayValue value={ethAmount} toWei post=" ETH" color="primary" />{' '}
            {usdAmount ? `($${usdAmount})` : `(< $0.01)`} to buy approximately{' '}
            <DisplayValue
              value={expectedMETamount}
              color="primary"
              post=" MET"
            />{' '}
            at current price.
          </Text>
        )}
      </Confirmation>
    )
  }
}

ConfirmPurchase.navigationOptions = {
  headerTitle: 'Buy Metronome'
}

export default ConfirmPurchase
