import React from 'react'

import { Text } from '../../../common'

export default class AuctionDetails extends React.Component {
  render() {
    return (
      <Text>
        <Text color="copy" size="small" weight="semibold">
          MET
        </Text>{' '}
        <Text color="copy" size="xSmall">
          PURCHASED IN AUCTION
        </Text>
      </Text>
    )
  }
}
