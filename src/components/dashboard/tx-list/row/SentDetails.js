import FilteredMessage from 'metronome-wallet-ui-logic/src/components/FilteredMessage'
import PropTypes from 'prop-types'
import React from 'react'

import { Text } from '../../../common'

export default class SentDetails extends React.Component {
  static propTypes = {
    isCancelApproval: PropTypes.bool,
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
        {this.props.isPending ? (
          this.props.isApproval ? (
            'PENDING ALLOWANCE FOR'
          ) : this.props.isCancelApproval ? (
            'PENDING CANCEL ALLOWANCE FOR'
          ) : (
            'PENDING TO'
          )
        ) : this.props.isApproval ? (
          'ALLOWANCE SET FOR'
        ) : this.props.isCancelApproval ? (
          'ALLOWANCE CANCELLED FOR'
        ) : (
          <React.Fragment>
            SENT TO{' '}
            <FilteredMessage
              withDefault={str =>
                `${str.substring(0, 6)}…${str.substring(str.length - 4)}`
              }
            >
              {this.props.to}
            </FilteredMessage>
          </React.Fragment>
        )}
      </Text>
    )
  }
}
