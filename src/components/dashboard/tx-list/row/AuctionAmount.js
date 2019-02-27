import PropTypes from 'prop-types'
import React from 'react'

import { DisplayValue, Text } from '../../../common'

export default class AuctionAmount extends React.Component {
  static propTypes = {
    metBoughtInAuction: PropTypes.string,
    coinSpentInAuction: PropTypes.string,
    isFailed: PropTypes.bool.isRequired
  }

  render() {
    return (
      <React.Fragment>
        <DisplayValue
          isCoin
          color={this.props.isFailed ? 'danger' : 'primary'}
          value={this.props.coinSpentInAuction}
          size="medium"
        />

        {this.props.metBoughtInAuction && (
          <React.Fragment>
            <Text color={this.props.isFailed ? 'danger' : 'primary'} mx={1}>
              &rarr;
            </Text>
            <DisplayValue
              color={this.props.isFailed ? 'danger' : 'primary'}
              size="medium"
              value={this.props.metBoughtInAuction}
              post=" MET"
            />
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}
