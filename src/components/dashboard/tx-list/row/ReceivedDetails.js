import FilteredMessage from 'metronome-wallet-ui-logic/src/components/FilteredMessage'
import PropTypes from 'prop-types'
import React from 'react'

import { Text } from '../../../common'

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
          <FilteredMessage
            withDefault={str =>
              `${str.substring(0, 6)}…${str.substring(str.length - 4)}`
            }
          >
            {this.props.from}
          </FilteredMessage>
        </Text>
      </Text>
    )
  }
}
