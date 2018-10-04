import { DisplayValue, View, Text, Btn } from '../common'
import withReceiptDrawerState from '../../shared/hocs/withReceiptDrawerState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

class ReceiptDrawer extends React.Component {
  static propTypes = {
    onExplorerLinkClick: PropTypes.func.isRequired,
    copyToClipboard: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const { params: routeParams } = this.props.navigation.state

    return (
      <View grow={1} px={2} scroll bg="dark">
        {routeParams.tx.txType !== 'unknown' && (
          <AmountRow
            symbol={routeParams.symbol}
            value={routeParams.value}
            tx={routeParams.tx}
          />
        )}

        <TypeRow
          isCancelApproval={routeParams.isCancelApproval}
          isApproval={routeParams.isApproval}
          tx={routeParams.tx}
        />

        {routeParams.tx.txType === 'received' && (
          <RN.TouchableOpacity
            onPress={() => this.props.copyToClipboard(routeParams.from)}
          >
            <View my={3}>
              <Text size="large">
                {routeParams.isPending ? 'Pending' : 'Received'} from
              </Text>
              <Text size="medium" opacity={0.8} mt={1}>
                {routeParams.from}
              </Text>
            </View>
          </RN.TouchableOpacity>
        )}

        {routeParams.tx.txType === 'sent' && (
          <RN.TouchableOpacity
            onPress={() => this.props.copyToClipboard(routeParams.to)}
          >
            <View my={3}>
              <Text size="large">
                {routeParams.isPending ? 'Pending' : 'Sent'} to
              </Text>
              <Text size="medium" opacity={0.8} mt={1}>
                {routeParams.to}
              </Text>
            </View>
          </RN.TouchableOpacity>
        )}

        {!!routeParams.confirmations && (
          <View row my={3}>
            <Text size="large">Confirmations</Text>
            <View grow={1} align="flex-end">
              <Text size="large">{routeParams.confirmations}</Text>
            </View>
          </View>
        )}

        {routeParams.receipt && (
          <View row my={3}>
            <Text size="large">Gas used</Text>
            <View grow={1} align="flex-end">
              <Text size="large" opacity={0.8}>
                {routeParams.receipt.gasUsed}
              </Text>
            </View>
          </View>
        )}

        <View my={3}>
          <Text size="large">Transaction hash</Text>
          <Text size="medium" opacity={0.8} mt={1}>
            {routeParams.transaction.hash}
          </Text>
        </View>

        {routeParams.transaction.blockNumber && (
          <View row my={3}>
            <Text size="large">Block number</Text>
            <View grow={1} align="flex-end" opacity={0.8}>
              <Text size="large">{routeParams.transaction.blockNumber}</Text>
            </View>
          </View>
        )}
        <View my={4} px={2}>
          <Btn
            onPress={() =>
              this.props.onExplorerLinkClick(routeParams.transaction.hash)
            }
            label="View in Explorer"
          />
        </View>
      </View>
    )
  }
}

const AmountRow = ({ tx, value, symbol }) => (
  <View row my={3}>
    <Text size="large">Amount</Text>
    <View grow={1} align="flex-end">
      {tx.txType === 'auction' ? (
        <React.Fragment>
          <DisplayValue
            value={tx.ethSpentInAuction}
            size="large"
            post=" ETH"
            color="primary"
          />
          {tx.mtnBoughtInAuction && (
            <React.Fragment>
              <Text mr={2} color="primary" mx={2} size="xLarge">
                &darr;
              </Text>
              <DisplayValue
                size="large"
                value={tx.mtnBoughtInAuction}
                post=" MET"
                color="primary"
              />
            </React.Fragment>
          )}
        </React.Fragment>
      ) : tx.txType === 'converted' ? (
        <React.Fragment>
          <DisplayValue
            value={tx.fromValue}
            size="large"
            post={tx.convertedFrom === 'ETH' ? ' ETH' : ' MET'}
            color="primary"
          />
          {tx.toValue && (
            <React.Fragment>
              <Text mx={2} size="xLarge" color="primary">
                &darr;
              </Text>
              <DisplayValue
                value={tx.toValue}
                size="large"
                post={tx.convertedFrom === 'ETH' ? ' MET' : ' ETH'}
                color="primary"
              />
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <DisplayValue
          value={value}
          post={` ${symbol}`}
          size="large"
          color="primary"
        />
      )}
    </View>
  </View>
)

AmountRow.propTypes = {
  symbol: PropTypes.string,
  value: PropTypes.string,
  tx: PropTypes.object.isRequired
}

const TypeRow = ({ tx, isApproval, isCancelApproval }) => (
  <View row my={3}>
    <Text size="large">Type</Text>
    <View grow={1} align="flex-end">
      <Text size="large" opacity={0.8}>
        {isCancelApproval
          ? 'Allowance canceled'
          : isApproval
            ? 'Allowance set'
            : tx.txType.toUpperCase()}
      </Text>
    </View>
  </View>
)

TypeRow.propTypes = {
  isCancelApproval: PropTypes.bool,
  isApproval: PropTypes.bool,
  tx: PropTypes.shape({
    txType: PropTypes.string.isRequired
  }).isRequired
}

const EnhancedComponent = withReceiptDrawerState(ReceiptDrawer)

EnhancedComponent.navigationOptions = {
  headerTitle: 'Transaction Receipt'
}

export default EnhancedComponent
