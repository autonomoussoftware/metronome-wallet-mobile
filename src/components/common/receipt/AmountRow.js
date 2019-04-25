import PropTypes from 'prop-types'
import React from 'react'

import DisplayValue from '../DisplayValue'
import View from '../View'
import Text from '../Text'

export default class AmountRow extends React.Component {
  static propTypes = {
    metBoughtInAuction: PropTypes.string,
    coinSpentInAuction: PropTypes.string,
    convertedFrom: PropTypes.string,
    coinSymbol: PropTypes.string.isRequired,
    fromValue: PropTypes.string,
    toValue: PropTypes.string,
    txType: PropTypes.oneOf([
      'import-requested',
      'attestation',
      'converted',
      'exported',
      'imported',
      'received',
      'auction',
      'unknown',
      'sent'
    ]).isRequired,
    symbol: PropTypes.string,
    value: PropTypes.string
  }

  // eslint-disable-next-line complexity
  render() {
    return (
      <View row my={3}>
        <Text size="large">Amount</Text>
        <View grow={1} align="flex-end">
          {this.props.txType === 'auction' ? (
            <React.Fragment>
              <DisplayValue
                isCoin
                value={this.props.coinSpentInAuction}
                color="primary"
                size="large"
              />
              {this.props.metBoughtInAuction && (
                <React.Fragment>
                  <Text mr={2} color="primary" mx={2} size="xLarge">
                    &darr;
                  </Text>
                  <DisplayValue
                    size="large"
                    value={this.props.metBoughtInAuction}
                    post=" MET"
                    color="primary"
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          ) : this.props.txType === 'converted' ? (
            <React.Fragment>
              <DisplayValue
                value={this.props.fromValue}
                size="large"
                post={
                  this.props.convertedFrom === 'coin'
                    ? ` ${this.props.coinSymbol}`
                    : ' MET'
                }
                color="primary"
              />
              {this.props.toValue && (
                <React.Fragment>
                  <Text mx={2} size="xLarge" color="primary">
                    &darr;
                  </Text>
                  <DisplayValue
                    value={this.props.toValue}
                    size="large"
                    post={
                      this.props.convertedFrom === 'coin'
                        ? ' MET'
                        : ` ${this.props.coinSymbol}`
                    }
                    color="primary"
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <DisplayValue
              value={this.props.value}
              color="primary"
              post={
                this.props.txType === 'import-requested' ||
                this.props.txType === 'imported' ||
                this.props.txType === 'exported'
                  ? ' MET'
                  : ` ${
                      this.props.symbol === 'coin'
                        ? this.props.coinSymbol
                        : this.props.symbol
                    }`
              }
              size="large"
            />
          )}
        </View>
      </View>
    )
  }
}
