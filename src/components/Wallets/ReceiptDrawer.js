import { DisplayValue, View, Text, Btn } from '../common'
import { pageStatusPropTypes } from '../../utils'
import withReceiptDrawerState from '../../shared/hocs/withReceiptDrawerState'
import PropTypes from 'prop-types'
import React from 'react'

class ReceiptDrawer extends React.Component {
  static propTypes = {
    onExplorerLinkClick: PropTypes.func.isRequired,
    ...pageStatusPropTypes
  }

  render() {
    const { state: routeState } = this.props.location

    if (this.props.pageStatus !== 'entered') return null

    return (
      <View flex={1}>
        <View grow={1} mb={4} py={4} px={2} scroll>
          {routeState.tx.txType !== 'unknown' && (
            <View row mb={3}>
              <Text size="large">Amount</Text>
              <View grow={1} align="flex-end">
                {routeState.tx.txType === 'auction' ? (
                  <React.Fragment>
                    <DisplayValue
                      value={routeState.tx.ethSpentInAuction}
                      size="large"
                      post=" ETH"
                      color="primary"
                    />
                    {routeState.tx.mtnBoughtInAuction && (
                      <React.Fragment>
                        <Text mr={2} color="primary" mx={2} size="xLarge">
                          &darr;
                        </Text>
                        <DisplayValue
                          size="large"
                          value={routeState.tx.mtnBoughtInAuction}
                          post=" MET"
                          color="primary"
                        />
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : routeState.tx.txType === 'converted' ? (
                  <React.Fragment>
                    <DisplayValue
                      value={routeState.tx.fromValue}
                      size="large"
                      post={
                        routeState.tx.convertedFrom === 'ETH' ? ' ETH' : ' MET'
                      }
                      color="primary"
                    />
                    {routeState.tx.toValue && (
                      <React.Fragment>
                        <Text mx={2} size="xLarge" color="primary">
                          &darr;
                        </Text>
                        <DisplayValue
                          value={routeState.tx.toValue}
                          size="large"
                          post={
                            routeState.tx.convertedFrom === 'ETH'
                              ? ' MET'
                              : ' ETH'
                          }
                          color="primary"
                        />
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : (
                  <DisplayValue
                    value={routeState.value}
                    post={` ${routeState.symbol}`}
                    size="large"
                    color="primary"
                  />
                )}
              </View>
            </View>
          )}

          <View row my={3}>
            <Text size="large">Type</Text>
            <View grow={1} align="flex-end">
              <Text size="large" opacity={0.8}>
                {routeState.isCancelApproval
                  ? 'Allowance canceled'
                  : routeState.isApproval
                    ? 'Allowance set'
                    : routeState.tx.txType.toUpperCase()}
              </Text>
            </View>
          </View>

          {routeState.tx.txType === 'received' && (
            <View my={3}>
              <Text size="large">
                {routeState.isPending ? 'Pending' : 'Received'} from
              </Text>
              <Text size="medium" opacity={0.8} mt={1}>
                {routeState.from}
              </Text>
            </View>
          )}

          {routeState.tx.txType === 'sent' && (
            <View my={3}>
              <Text size="large">
                {routeState.isPending ? 'Pending' : 'Sent'} to
              </Text>
              <Text size="medium" opacity={0.8} mt={1}>
                {routeState.to}
              </Text>
            </View>
          )}

          {routeState.confirmations && (
            <View row my={3}>
              <Text size="large">Confirmations</Text>
              <View grow={1} align="flex-end">
                <Text size="large">{routeState.confirmations}</Text>
              </View>
            </View>
          )}

          {routeState.receipt && (
            <View row my={3}>
              <Text size="large">Gas used</Text>
              <View grow={1} align="flex-end">
                <Text size="large" opacity={0.8}>
                  {routeState.receipt.gasUsed}
                </Text>
              </View>
            </View>
          )}

          <View my={3}>
            <Text size="large">Transaction hash</Text>
            <Text size="medium" opacity={0.8} mt={1}>
              {routeState.transaction.hash}
            </Text>
          </View>

          {routeState.transaction.blockNumber && (
            <View row my={3}>
              <Text size="large">Block number</Text>
              <View grow={1} align="flex-end" opacity={0.8}>
                <Text size="large">{routeState.transaction.blockNumber}</Text>
              </View>
            </View>
          )}
        </View>
        <View pb={4} px={2}>
          <Btn
            onPress={routeState.onExplorerLinkClick}
            label="VIEW IN EXPLORER"
          />
        </View>
      </View>
    )
  }
}

export default withReceiptDrawerState(ReceiptDrawer)
