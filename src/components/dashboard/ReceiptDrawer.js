import { DisplayValue, BaseBtn, View, Text, Btn } from '../common'
import withReceiptDrawerState from '../../shared/hocs/withReceiptDrawerState'
import RefreshControl from '../common/RefreshControl'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

class ReceiptDrawer extends React.Component {
  static propTypes = {
    onExplorerLinkClick: PropTypes.func.isRequired,
    copyToClipboard: PropTypes.func.isRequired,
    onRefreshClick: PropTypes.func.isRequired,
    confirmations: PropTypes.number.isRequired,
    navigation: PropTypes.shape({
      setParams: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          hash: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired,
    refreshStatus: PropTypes.oneOf(['init', 'pending', 'success', 'failure'])
      .isRequired,
    refreshError: PropTypes.string,
    isPending: PropTypes.bool.isRequired,
    tx: PropTypes.shape({
      hash: PropTypes.string.isRequired
    }).isRequired
  }

  viewRef = null

  storeViewRef = element => {
    this.viewRef = element
  }

  onRefresh = () => {
    this.props.onRefreshClick()
    this.viewRef.scrollTo({ y: 0, animated: true })
  }

  componentDidMount() {
    this.props.navigation.setParams({ onHeaderRightPress: this.onRefresh })
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.refreshStatus !== prevProps.refreshStatus &&
      this.props.refreshStatus === 'failure'
    ) {
      RN.Alert.alert('Error', this.props.refreshError)
    }
  }

  render() {
    const { confirmations, isPending, tx } = this.props

    return (
      <View
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshStatus === 'pending'}
            onRefresh={this.onRefresh}
          />
        }
        innerRef={this.storeViewRef}
        scroll
        grow={1}
        bg="dark"
        px={2}
      >
        {tx.txType !== 'unknown' && <AmountRow tx={tx} />}

        <TypeRow tx={tx} />

        {tx.txType === 'received' && (
          <RN.TouchableOpacity
            onPress={() => this.props.copyToClipboard(tx.from)}
          >
            <View my={3}>
              <Text size="large">
                {isPending ? 'Pending' : 'Received'} from
              </Text>
              <Text size="medium" opacity={0.8} mt={1}>
                {tx.from}
              </Text>
            </View>
          </RN.TouchableOpacity>
        )}

        {tx.txType === 'sent' && (
          <RN.TouchableOpacity
            onPress={() => this.props.copyToClipboard(tx.to)}
          >
            <View my={3}>
              <Text size="large">{isPending ? 'Pending' : 'Sent'} to</Text>
              <Text size="medium" opacity={0.8} mt={1}>
                {tx.to}
              </Text>
            </View>
          </RN.TouchableOpacity>
        )}

        <View row my={3}>
          <Text size="large">Confirmations</Text>
          <View grow={1} align="flex-end">
            <Text size="large">{confirmations}</Text>
          </View>
        </View>

        {tx.gasUsed && (
          <View row my={3}>
            <Text size="large">Gas used</Text>
            <View grow={1} align="flex-end">
              <Text size="large" opacity={0.8}>
                {tx.gasUsed}
              </Text>
            </View>
          </View>
        )}

        <View my={3}>
          <Text size="large">Transaction hash</Text>
          <Text size="medium" opacity={0.8} mt={1}>
            {tx.hash}
          </Text>
        </View>

        {tx.blockNumber && (
          <View row my={3}>
            <Text size="large">Block number</Text>
            <View grow={1} align="flex-end" opacity={0.8}>
              <Text size="large">{tx.blockNumber}</Text>
            </View>
          </View>
        )}
        <View my={4}>
          <Btn
            onPress={() => this.props.onExplorerLinkClick(tx.hash)}
            label="View in Explorer"
          />
        </View>
      </View>
    )
  }
}

const AmountRow = ({ tx }) => (
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
          value={tx.value}
          post={` ${tx.symbol}`}
          size="large"
          color="primary"
        />
      )}
    </View>
  </View>
)

AmountRow.propTypes = {
  tx: PropTypes.object.isRequired
}

const TypeRow = ({ tx }) => (
  <View row my={3}>
    <Text size="large">Type</Text>
    <View grow={1} align="flex-end">
      <Text size="large" opacity={0.8}>
        {tx.isCancelApproval
          ? 'Allowance canceled'
          : tx.isApproval
            ? 'Allowance set'
            : tx.txType.toUpperCase()}
      </Text>
    </View>
  </View>
)

TypeRow.propTypes = {
  tx: PropTypes.shape({
    isCancelApproval: PropTypes.bool,
    isApproval: PropTypes.bool,
    txType: PropTypes.string.isRequired
  }).isRequired
}

const EnhancedComponent = withReceiptDrawerState(
  props => props.navigation.state.params.hash
)(ReceiptDrawer)

EnhancedComponent.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Transaction Receipt',
  headerRight: (
    <BaseBtn
      textProps={{ weight: 'semibold', size: 'medium' }}
      onPress={navigation.getParam('onHeaderRightPress', null)}
      label="Refresh"
      mr={1}
    />
  )
})

export default EnhancedComponent
