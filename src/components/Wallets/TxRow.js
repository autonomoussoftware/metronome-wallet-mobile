import { DisplayValue, View, Text } from '../common'
import withTxRowState from '../../shared/hocs/withTxRowState'
import ConverterIcon from '../icons/ConverterIcon'
import AuctionIcon from '../icons/AuctionIcon'
import PropTypes from 'prop-types'
import TxIcon from '../icons/TxIcon'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'
// import theme from '../theme';

class TxRow extends React.Component {
  static propTypes = {
    contractCallFailed: PropTypes.bool.isRequired,
    mtnBoughtInAuction: PropTypes.string,
    ethSpentInAuction: PropTypes.string,
    confirmations: PropTypes.number.isRequired,
    convertedFrom: PropTypes.string,
    isProcessing: PropTypes.bool,
    fromValue: PropTypes.string,
    isPending: PropTypes.bool.isRequired,
    isFailed: PropTypes.bool.isRequired,
    toValue: PropTypes.string,
    symbol: PropTypes.string,
    txType: PropTypes.oneOf([
      'converted',
      'received',
      'auction',
      'unknown',
      'sent'
    ]).isRequired,
    value: PropTypes.string.isRequired
  }

  // state = {};

  _renderIcon() {
    if (this.props.txType === 'unknown' || this.props.isPending) {
      return (
        <View style={styles.confirmations}>
          <Text color="weak">{this.props.confirmations}</Text>
        </View>
      )
    }
    switch (this.props.txType) {
      case 'received':
      case 'sent':
        return (
          <TxIcon
            color={this.props.contractCallFailed ? 'danger' : 'primary'}
          />
        )
      case 'converted':
        return (
          <ConverterIcon
            color={this.props.contractCallFailed ? 'danger' : 'primary'}
          />
        )
      case 'auction':
        return (
          <AuctionIcon
            color={this.props.contractCallFailed ? 'danger' : 'primary'}
          />
        )
    }
  }

  _renderAmount() {
    return (
      <View
        // isCancelApproval={isCancelApproval}
        // isPending={isPending}
        opacity={this.props.isFailed ? 0.5 : 1}
        // row
        align="flex-end"
      >
        {this.props.txType === 'auction' ? (
          <React.Fragment>
            <DisplayValue
              color="primary"
              size="xLarge"
              value={this.props.ethSpentInAuction}
              post=" ETH"
            />

            {this.props.mtnBoughtInAuction && (
              <React.Fragment>
                <Text color="primary" mr={2}>
                  &darr;
                </Text>
                <DisplayValue
                  color="primary"
                  size="xLarge"
                  value={this.props.mtnBoughtInAuction}
                  post=" MET"
                />
              </React.Fragment>
            )}
          </React.Fragment>
        ) : this.props.txType === 'converted' ? (
          <React.Fragment>
            {this.props.fromValue ? (
              <DisplayValue
                color="primary"
                size="xLarge"
                value={this.props.fromValue}
                post={this.props.convertedFrom === 'ETH' ? ' ETH' : ' MET'}
              />
            ) : (
              <Text>New transaction</Text>
            )}

            {this.props.fromValue &&
              this.props.toValue && (
                <React.Fragment>
                  <Text color="primary" mr={2}>
                    &darr;
                  </Text>
                  <DisplayValue
                    color="primary"
                    size="xLarge"
                    value={this.props.toValue}
                    post={this.props.convertedFrom === 'ETH' ? ' MET' : ' ETH'}
                  />
                </React.Fragment>
              )}
          </React.Fragment>
        ) : this.props.txType === 'unknown' || this.props.isProcessing ? (
          <Text>New transaction</Text>
        ) : (
          <DisplayValue
            color="primary"
            size="xLarge"
            value={this.props.value}
            post={` ${this.props.symbol}`}
          />
        )}
      </View>
    )
  }

  _renderDetails() {
    return (
      <View grow={0} mt={1}>
        <Text size="medium">
          {(this.props.txType === 'auction' &&
            !this.props.isPending &&
            !this.props.mtnBoughtInAuction) ||
          this.props.contractCallFailed ? (
            <Text color="danger">Failed Transaction</Text>
          ) : (
            <React.Fragment>
              {this.props.txType === 'converted' && (
                <View>
                  <Text color="weak" size="medium">
                    {this.props.isPending && 'Pending conversion from '}
                    <Text color="copy">{this.props.convertedFrom}</Text>
                    {this.props.isPending ? ' to ' : ' converted to '}
                    <Text color="copy">
                      {this.props.convertedFrom === 'ETH' ? 'MET' : 'ETH'}
                    </Text>
                  </Text>
                </View>
              )}

              {this.props.txType === 'received' && (
                <View>
                  <Text
                    color="weak"
                    size="medium"
                    ellipsizeMode="middle"
                    numberOfLines={1}
                  >
                    {this.props.isPending ? 'Pending' : 'Received'} from{' '}
                    <Text color="copy" ellipsizeMode="middle" numberOfLines={1}>
                      {this.props.from}
                    </Text>
                  </Text>
                </View>
              )}

              {this.props.txType === 'auction' && (
                <View>
                  <Text color="weak" size="medium">
                    <Text color="copy">MET</Text> purchased in auction
                  </Text>
                </View>
              )}

              {this.props.txType === 'sent' && (
                <View color="weak">
                  <Text
                    color="weak"
                    size="medium"
                    ellipsizeMode="middle"
                    numberOfLines={1}
                  >
                    {this.props.isPending
                      ? this.props.isApproval
                        ? 'Pending allowance for'
                        : this.props.isCancelApproval
                          ? 'Pending cancel allowance for'
                          : 'Pending to'
                      : this.props.isApproval
                        ? 'Allowance set for'
                        : this.props.isCancelApproval
                          ? 'Allowance cancelled for'
                          : 'Sent to'}{' '}
                    {this.props.to === this.props.MTN_TOKEN_ADDR ? (
                      'MET TOKEN CONTRACT'
                    ) : this.props.to === this.props.CONVERTER_ADDR ? (
                      'CONVERTER CONTRACT'
                    ) : (
                      <Text
                        size="medium"
                        color="copy"
                        ellipsizeMode="middle"
                        numberOfLines={1}
                      >
                        {this.props.to}
                      </Text>
                    )}
                  </Text>
                </View>
              )}
              {this.props.txType === 'unknown' && (
                <View color="weak">Waiting for metadata</View>
              )}
            </React.Fragment>
          )}
        </Text>
      </View>
    )
  }

  render() {
    // const {} = this.state;
    // const {} = this.props;

    return (
      <RN.TouchableOpacity
        activeOpacity={0.95}
        onPress={() => null}
        style={{
          backgroundColor: theme.colors.light,
          paddingLeft: theme.spacing(2)
        }}
      >
        <View
          style={styles.container}
          align="flex-start"
          row
          bg="light"
          pr={1}
          py={1.5}
          grow={1}
        >
          {this._renderIcon()}

          <View grow={1} shrink={1} align="flex-end" ml={2}>
            {this._renderAmount()}
            {this._renderDetails()}
          </View>
        </View>
      </RN.TouchableOpacity>
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightShade
  },
  confirmations: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.weak,
    width: 24,
    height: 24
    // marginLeft: -2
  }
})

export default withTxRowState(TxRow)
