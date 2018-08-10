import { DisplayValue, View, Text } from '../common'
import withTxRowState from '../../shared/hocs/withTxRowState'
import { withRouter } from 'react-router'
import ConverterIcon from '../icons/ConverterIcon'
import AuctionIcon from '../icons/AuctionIcon'
import PropTypes from 'prop-types'
import TxIcon from '../icons/TxIcon'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'

class TxRow extends React.Component {
  static propTypes = {
    contractCallFailed: PropTypes.bool.isRequired,
    mtnBoughtInAuction: PropTypes.string,
    ethSpentInAuction: PropTypes.string,
    isCancelApproval: PropTypes.bool,
    CONVERTER_ADDR: PropTypes.string.isRequired,
    MTN_TOKEN_ADDR: PropTypes.string.isRequired,
    confirmations: PropTypes.number.isRequired,
    convertedFrom: PropTypes.string,
    isProcessing: PropTypes.bool,
    isApproval: PropTypes.bool,
    fromValue: PropTypes.string,
    isPending: PropTypes.bool.isRequired,
    isFailed: PropTypes.bool.isRequired,
    toValue: PropTypes.string,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    symbol: PropTypes.string,
    txType: PropTypes.oneOf([
      'converted',
      'received',
      'auction',
      'unknown',
      'sent'
    ]).isRequired,
    value: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }

  _renderIcon() {
    if (this.props.txType === 'unknown' || this.props.isPending) {
      return (
        <View style={styles.confirmations}>
          <Text color="dark" size="xSmall" weight="semibold">
            {this.props.confirmations}
          </Text>
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
        opacity={this.props.isPending ? 0.5 : 1}
        align="flex-end"
        row
        mt={0.2}
      >
        {this.props.txType === 'auction' ? (
          <React.Fragment>
            <DisplayValue
              color={this.props.isFailed ? 'danger' : 'primary'}
              value={this.props.ethSpentInAuction}
              size="large"
              post=" ETH"
            />

            {this.props.mtnBoughtInAuction && (
              <React.Fragment>
                <Text color={this.props.isFailed ? 'danger' : 'primary'} mx={1}>
                  &rarr;
                </Text>
                <DisplayValue
                  color={this.props.isFailed ? 'danger' : 'primary'}
                  size="large"
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
                color={this.props.isFailed ? 'danger' : 'primary'}
                value={this.props.fromValue}
                size="large"
                post={this.props.convertedFrom === 'ETH' ? ' ETH' : ' MET'}
              />
            ) : (
              <Text>New transaction</Text>
            )}

            {this.props.fromValue &&
              this.props.toValue && (
                <React.Fragment>
                  <Text
                    color={this.props.isFailed ? 'danger' : 'primary'}
                    mx={1}
                  >
                    &rarr;
                  </Text>
                  <DisplayValue
                    color={this.props.isFailed ? 'danger' : 'primary'}
                    value={this.props.toValue}
                    size="large"
                    post={this.props.convertedFrom === 'ETH' ? ' MET' : ' ETH'}
                  />
                </React.Fragment>
              )}
          </React.Fragment>
        ) : this.props.txType === 'unknown' || this.props.isProcessing ? (
          <Text>New transaction</Text>
        ) : (
          <DisplayValue
            color={this.props.isFailed ? 'danger' : 'primary'}
            style={{ lineHeight: theme.sizes.large }}
            value={this.props.value}
            post={` ${this.props.symbol}`}
            size="large"
          />
        )}
      </View>
    )
  }

  _renderDetails() {
    return (
      <View mt={0.5} opacity={this.props.isPending ? 0.8 : 1}>
        {(this.props.txType === 'auction' &&
          !this.props.isPending &&
          !this.props.mtnBoughtInAuction) ||
        this.props.contractCallFailed ? (
          <Text size="xSmall" color="danger" ls={0.4}>
            FAILED TRANSACTION
          </Text>
        ) : (
          <React.Fragment>
            {this.props.txType === 'converted' && (
              <Text>
                {this.props.isPending && (
                  <Text color="copy" size="xSmall" ls={0.4}>
                    PENDING CONVERSION FROM
                  </Text>
                )}

                <Text color="copy" weight="semibold" size="small">
                  {this.props.convertedFrom}
                </Text>

                <Text color="copy" size="xSmall" ls={0.4}>
                  {this.props.isPending ? ' TO ' : ' CONVERTED TO '}
                </Text>

                <Text color="copy" weight="semibold" size="small">
                  {this.props.convertedFrom === 'ETH' ? 'MET' : 'ETH'}
                </Text>
              </Text>
            )}

            {this.props.txType === 'received' && (
              <Text numberOfLines={1} ellipsizeMode="middle">
                <Text color="copy" size="xSmall">
                  {this.props.isPending ? 'PENDING' : 'RECEIVED'} FROM{' '}
                </Text>
                <Text color="copy" weight="semibold" size="small">
                  {this.props.from}
                </Text>
              </Text>
            )}

            {this.props.txType === 'auction' && (
              <Text>
                <Text color="copy" size="small" weight="semibold">
                  MET
                </Text>{' '}
                <Text color="copy" size="xSmall">
                  PURCHASED IN AUCTION
                </Text>
              </Text>
            )}

            {this.props.txType === 'sent' && (
              <Text
                ellipsizeMode="middle"
                numberOfLines={1}
                align="right"
                color="copy"
                size="xSmall"
                ls={0.4}
              >
                {this.props.isPending
                  ? this.props.isApproval
                    ? 'PENDING ALLOWANCE FOR'
                    : this.props.isCancelApproval
                      ? 'PENDING CANCEL ALLOWANCE FOR'
                      : 'PENDING TO'
                  : this.props.isApproval
                    ? 'ALLOWANCE SET FOR'
                    : this.props.isCancelApproval
                      ? 'ALLOWANCE CANCELLED FOR'
                      : 'SENT TO'}{' '}
                {this.props.to === this.props.MTN_TOKEN_ADDR ? (
                  'MET TOKEN CONTRACT'
                ) : this.props.to === this.props.CONVERTER_ADDR ? (
                  'CONVERTER CONTRACT'
                ) : (
                  <Text weight="semibold" color="copy" size="small">
                    {this.props.to}
                  </Text>
                )}
              </Text>
            )}
            {this.props.txType === 'unknown' && (
              <Text color="weak">Waiting for metadata</Text>
            )}
          </React.Fragment>
        )}
      </View>
    )
  }

  onPress = () => {
    const { history, ...other } = this.props
    history.push('/wallets/receipt', other)
  }

  render() {
    return (
      <RN.TouchableOpacity
        activeOpacity={0.95}
        onPress={this.onPress}
        style={styles.touchableContainer}
      >
        <View style={styles.container} pr={2} py={1.5} row>
          {this._renderIcon()}
          <View grow={1} shrink={1} align="flex-end" ml={1}>
            {this._renderAmount()}
            {this._renderDetails()}
          </View>
        </View>
      </RN.TouchableOpacity>
    )
  }
}

const styles = RN.StyleSheet.create({
  touchableContainer: {
    backgroundColor: theme.colors.light,
    paddingLeft: theme.spacing(2)
  },
  container: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightShade
  },
  confirmations: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.dark,
    opacity: 0.5,
    width: 24,
    height: 24
  }
})

export default withTxRowState(withRouter(TxRow))