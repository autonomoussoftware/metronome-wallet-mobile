import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'

import { DisplayValue, Text } from '../../../common'
import ConvertedAmount from './ConvertedAmount'
import AuctionAmount from './AuctionAmount'

export default class Amount extends React.Component {
  static propTypes = {
    isAttestationValid: PropTypes.bool,
    isProcessing: PropTypes.bool,
    coinSymbol: PropTypes.string.isRequired,
    isFailed: PropTypes.bool.isRequired,
    symbol: PropTypes.string,
    txType: PropTypes.oneOf([
      'import-requested',
      'attestation',
      'converted',
      'imported',
      'exported',
      'received',
      'auction',
      'unknown',
      'sent'
    ]).isRequired,
    value: PropTypes.string.isRequired
  }

  // eslint-disable-next-line complexity
  render() {
    const { isProcessing, txType, isFailed, value, symbol } = this.props

    if (txType === 'unknown' || isProcessing) {
      return <Text color="copy">New transaction</Text>
    }

    switch (txType) {
      case 'converted':
        return <ConvertedAmount {...this.props} />
      case 'auction':
        return <AuctionAmount {...this.props} />
      case 'attestation':
        return (
          <Text color="copy">
            {this.props.isAttestationValid
              ? 'Attestation Valid'
              : 'Attestation Invalid'}
          </Text>
        )
      default:
        return (
          <DisplayValue
            style={{ lineHeight: theme.sizes.large }}
            color={isFailed ? 'danger' : 'primary'}
            value={value}
            size="large"
            post={
              this.props.txType === 'import-requested' ||
              this.props.txType === 'imported' ||
              this.props.txType === 'exported'
                ? ' MET'
                : ` ${
                    symbol === 'coin'
                      ? this.props.coinSymbol
                      : this.props.symbol
                  }`
            }
          />
        )
    }
  }
}
