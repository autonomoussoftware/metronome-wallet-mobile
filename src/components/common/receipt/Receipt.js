import { toChecksumAddress } from 'web3-utils'
import withReceiptState from 'metronome-wallet-ui-logic/src/hocs/withReceiptState'
import PropTypes from 'prop-types'
import TimeAgo from 'metronome-wallet-ui-logic/src/components/TimeAgo'
import React from 'react'
import RN from 'react-native'

import RefreshControl from '../RefreshControl'
import DisplayValue from '../DisplayValue'
import AmountRow from './AmountRow'
import CopyIcon from '../../icons/CopyIcon'
import BaseBtn from '../BaseBtn'
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

  // eslint-disable-next-line complexity
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
          {tx.txType !== 'unknown' && tx.txType !== 'attestation' && (
            <AmountRow {...tx} coinSymbol={coinSymbol} isPending={isPending} />
          )}

          {tx.timestamp && (
            <View row my={3}>
              <Text size="large">Block mined</Text>
              <View grow={1} align="flex-end">
                <Text size="large">
                  <TimeAgo timestamp={tx.timestamp} />
                </Text>
              </View>
            </View>
          )}

          <TypeRow {...tx} />

          {(tx.txType === 'import-requested' ||
            tx.txType === 'imported' ||
            tx.txType === 'exported') &&
            tx.portFee && (
              <View row my={3}>
                <Text size="large">Fee</Text>
                <View grow={1} align="flex-end">
                  <Text size="large">
                    <DisplayValue value={tx.portFee} post=" MET" />
                  </Text>
                </View>
              </View>
            )}

          {tx.txType === 'received' && tx.from && (
            <RN.TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                this.props.copyToClipboard(toChecksumAddress(tx.from))
              }
            >
              <View my={3}>
                <View row justify="space-between">
                  <Text size="large">
                    {isPending ? 'Pending' : 'Received'} from
                  </Text>
                  <CopyIcon opacity={0.5} width="20" />
                </View>

                <Text size="small" opacity={0.8} mt={1}>
                  {toChecksumAddress(tx.from)}
                </Text>
              </View>
            </RN.TouchableOpacity>
          )}

          {tx.txType === 'sent' && tx.to && (
            <RN.TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                this.props.copyToClipboard(toChecksumAddress(tx.to))
              }
            >
              <View my={3}>
                <View row justify="space-between">
                  <Text size="large">{isPending ? 'Pending' : 'Sent'} to</Text>
                  <CopyIcon opacity={0.5} width="20" />
                </View>
                <Text size="small" opacity={0.8} mt={1}>
                  {toChecksumAddress(tx.to)}
                </Text>
              </View>
            </RN.TouchableOpacity>
          )}

          {tx.txType === 'exported' && tx.exportedTo && (
            <View row my={3}>
              <Text size="large">
                {this.props.isPending ? 'Pending' : 'Exported'} to
              </Text>
              <View grow={1} align="flex-end">
                <Text size="large">{tx.exportedTo} chain</Text>
              </View>
            </View>
          )}

          {tx.txType === 'import-requested' && tx.importedFrom && (
            <View row my={3}>
              <Text size="large">
                {this.props.isPending
                  ? 'Pending import request'
                  : 'Import requested'}{' '}
                from
              </Text>
              <View grow={1} align="flex-end">
                <Text size="large">{tx.importedFrom} chain</Text>
              </View>
            </View>
          )}

          {tx.txType === 'imported' && tx.importedFrom && (
            <View row my={3}>
              <Text size="large">
                {this.props.isPending ? 'Pending Import' : 'Imported'} from
              </Text>
              <View grow={1} align="flex-end">
                <Text size="large">{tx.importedFrom} chain</Text>
              </View>
            </View>
          )}

          {tx.portDestinationAddress && (
            <RN.TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                this.props.copyToClipboard(
                  toChecksumAddress(tx.portDestinationAddress)
                )
              }
            >
              <View my={3}>
                <View row justify="space-between">
                  <Text size="large">Destination Address</Text>
                  <CopyIcon opacity={0.5} width="20" />
                </View>
                <Text size="small" opacity={0.8} mt={1}>
                  {toChecksumAddress(tx.portDestinationAddress)}
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

          {tx.portBurnHash && (
            <RN.TouchableOpacity
              activeOpacity={0.75}
              onPress={() => this.props.copyToClipboard(tx.portBurnHash)}
            >
              <View my={3}>
                <View row justify="space-between">
                  <Text size="large">Port burn hash</Text>
                  <CopyIcon opacity={0.5} width="20" />
                </View>
                <Text size="small" opacity={0.8} mt={1}>
                  {tx.portBurnHash}
                </Text>
              </View>
            </RN.TouchableOpacity>
          )}

          <View row my={3}>
            <Text size="large">Gas used</Text>
            <View grow={1} align="flex-end">
              <Text size={tx.gasUsed ? 'large' : 'small'} opacity={0.8}>
                {tx.gasUsed ? tx.gasUsed : 'Waiting to be mined'}
              </Text>
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

          {tx.meta && __DEV__ && (
            // eslint-disable-next-line no-alert
            <BaseBtn
              textProps={{ align: 'center' }}
              onPress={() =>
                RN.Alert.alert('Raw Metadata', JSON.stringify(tx.meta, null, 2))
              }
              label="Inspect raw metadata"
            />
          )}

          <View my={4}>
            <Btn
              onPress={this.props.onExplorerLinkClick}
              label="View in Explorer"
            />
          </View>
        </View>
      </View>
    )
  }
}

export default withReceiptState(Receipt)
