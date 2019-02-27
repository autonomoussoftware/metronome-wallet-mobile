import withReceiptState from 'metronome-wallet-ui-logic/src/hocs/withReceiptState'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import RefreshControl from '../RefreshControl'
import AmountRow from './AmountRow'
import CopyIcon from '../../icons/CopyIcon'
import TypeRow from './TypeRow'
import View from '../View'
import Text from '../Text'
import Btn from '../Btn'

class Receipt extends React.Component {
  static propTypes = {
    onExplorerLinkClick: PropTypes.func.isRequired,
    onRefreshRequest: PropTypes.func.isRequired,
    copyToClipboard: PropTypes.func.isRequired,
    confirmations: PropTypes.number.isRequired,
    coinSymbol: PropTypes.string.isRequired,
    refreshStatus: PropTypes.oneOf(['init', 'pending', 'success', 'failure'])
      .isRequired,
    refreshError: PropTypes.string,
    navigation: PropTypes.shape({
      setParams: PropTypes.func.isRequired
    }).isRequired,
    isPending: PropTypes.bool.isRequired,
    tx: PropTypes.object.isRequired
  }

  viewRef = null

  storeViewRef = element => {
    this.viewRef = element
  }

  onRefresh = () => {
    this.props.onRefreshRequest()
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
    const { confirmations, coinSymbol, isPending, tx } = this.props

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
      >
        <View px={2}>
          {tx.txType !== 'unknown' && (
            <AmountRow {...tx} coinSymbol={coinSymbol} isPending={isPending} />
          )}

          <TypeRow {...tx} />

          {tx.txType === 'received' && (
            <RN.TouchableOpacity
              activeOpacity={0.75}
              onPress={() => this.props.copyToClipboard(tx.from)}
            >
              <View my={3}>
                <View row justify="space-between">
                  <Text size="large">
                    {isPending ? 'Pending' : 'Received'} from
                  </Text>
                  <CopyIcon opacity={0.5} width="20" />
                </View>

                <Text size="small" opacity={0.8} mt={1}>
                  {tx.from}
                </Text>
              </View>
            </RN.TouchableOpacity>
          )}

          {tx.txType === 'sent' && (
            <RN.TouchableOpacity
              activeOpacity={0.75}
              onPress={() => this.props.copyToClipboard(tx.to)}
            >
              <View my={3}>
                <View row justify="space-between">
                  <Text size="large">{isPending ? 'Pending' : 'Sent'} to</Text>
                  <CopyIcon opacity={0.5} width="20" />
                </View>
                <Text size="small" opacity={0.8} mt={1}>
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

          <RN.TouchableOpacity
            activeOpacity={0.75}
            onPress={() => this.props.copyToClipboard(tx.hash)}
          >
            <View my={3}>
              <View row justify="space-between">
                <Text size="large">Transaction hash</Text>
                <CopyIcon opacity={0.5} width="20" />
              </View>
              <Text size="small" opacity={0.8} mt={1}>
                {tx.hash}
              </Text>
            </View>
          </RN.TouchableOpacity>

          <View row my={3} align="baseline">
            <Text size="large">Block number</Text>
            <View grow={1} align="flex-end" opacity={0.8}>
              <Text size={tx.blockNumber ? 'large' : 'small'}>
                {tx.blockNumber ? tx.blockNumber : 'Waiting to be mined'}
              </Text>
            </View>
          </View>

          <View row my={3}>
            <Text size="large">Gas used</Text>
            <View grow={1} align="flex-end">
              <Text size={tx.gasUsed ? 'large' : 'small'} opacity={0.8}>
                {tx.gasUsed ? tx.gasUsed : 'Waiting to be mined'}
              </Text>
            </View>
          </View>

          <View my={4}>
            <Btn
              onPress={() => this.props.onExplorerLinkClick(tx.hash)}
              label="View in Explorer"
            />
          </View>
        </View>
      </View>
    )
  }
}

export default withReceiptState(Receipt)
