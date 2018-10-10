import PropTypes from 'prop-types'
import { Text } from '../../common'
import React from 'react'

export default class ReceivedDetails extends React.Component {
  static propTypes = {
    isPending: PropTypes.bool.isRequired,
    from: PropTypes.string.isRequired
  }

  render() {
    return (
      <Text numberOfLines={1} ellipsizeMode="middle">
        <Text color="copy" size="xSmall">
          {this.props.isPending ? 'PENDING' : 'RECEIVED'} FROM{' '}
        </Text>
        <Text color="copy" weight="semibold" size="small">
          {this.props.from.substring(0, 6)}
          &hellip;
          {this.props.from.substring(this.props.from.length - 4)}
        </Text>
      </Text>
    )
  }
}
