import PropTypes from 'prop-types'
import React from 'react'

import { Text } from '../../../common'

export default class SentDetails extends React.Component {
  static propTypes = {
    converterAddress: PropTypes.string.isRequired,
    isCancelApproval: PropTypes.bool,
    metTokenAddress: PropTypes.string.isRequired,
    isApproval: PropTypes.bool,
    isPending: PropTypes.bool.isRequired,
    to: PropTypes.string.isRequired
  }

  render() {
    return (
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
        {this.props.to === this.props.metTokenAddress ? (
          'MET TOKEN CONTRACT'
        ) : this.props.to === this.props.converterAddress ? (
          'CONVERTER CONTRACT'
        ) : (
          <Text weight="semibold" color="copy" size="small">
            {this.props.to.substring(0, 6)}
            &hellip;
            {this.props.to.substring(this.props.to.length - 4)}
          </Text>
        )}
      </Text>
    )
  }
}
