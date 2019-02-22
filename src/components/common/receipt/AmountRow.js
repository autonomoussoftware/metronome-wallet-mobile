import PropTypes from 'prop-types'
import React from 'react'

import DisplayValue from '../DisplayValue'
import View from '../View'
import Text from '../Text'

export default class AmountRow extends React.Component {
  static propTypes = {
    mtnBoughtInAuction: PropTypes.string,
    ethSpentInAuction: PropTypes.string,
    convertedFrom: PropTypes.string,
    fromValue: PropTypes.string,
    toValue: PropTypes.string,
    txType: PropTypes.oneOf([
      'converted',
      'received',
      'auction',
      'unknown',
      'sent'
    ]).isRequired,
    symbol: PropTypes.string,
    value: PropTypes.string
  }

  render() {
    return (
      <View row my={3}>
        <Text size="large">Amount</Text>
        <View grow={1} align="flex-end">
          {this.props.txType === 'auction' ? (
            <React.Fragment>
              <DisplayValue
                value={this.props.ethSpentInAuction}
                size="large"
                post=" ETH"
                color="primary"
              />
              {this.props.mtnBoughtInAuction && (
                <React.Fragment>
                  <Text mr={2} color="primary" mx={2} size="xLarge">
                    &darr;
                  </Text>
                  <DisplayValue
                    size="large"
                    value={this.props.mtnBoughtInAuction}
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
                post={this.props.convertedFrom === 'ETH' ? ' ETH' : ' MET'}
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
                    post={this.props.convertedFrom === 'ETH' ? ' MET' : ' ETH'}
                    color="primary"
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <DisplayValue
              value={this.props.value}
              post={` ${this.props.symbol}`}
              size="large"
              color="primary"
            />
          )}
        </View>
      </View>
    )
  }
}
