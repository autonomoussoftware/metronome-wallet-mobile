import { DisplayValue, Text } from '../../common'
import PropTypes from 'prop-types'
import React from 'react'

export default class AuctionAmount extends React.Component {
  static propTypes = {
    mtnBoughtInAuction: PropTypes.string,
    ethSpentInAuction: PropTypes.string,
    isFailed: PropTypes.bool.isRequired
  }

  render() {
    return (
      <React.Fragment>
        <DisplayValue
          color={this.props.isFailed ? 'danger' : 'primary'}
          value={this.props.ethSpentInAuction}
          size="medium"
          post=" ETH"
        />

        {this.props.mtnBoughtInAuction && (
          <React.Fragment>
            <Text color={this.props.isFailed ? 'danger' : 'primary'} mx={1}>
              &rarr;
            </Text>
            <DisplayValue
              color={this.props.isFailed ? 'danger' : 'primary'}
              size="medium"
              value={this.props.mtnBoughtInAuction}
              post=" MET"
            />
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}
