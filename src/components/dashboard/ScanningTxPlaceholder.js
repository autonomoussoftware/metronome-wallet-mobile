import { Spinner, View, Text } from '../common'
import React from 'react'

export default class ScanningTxPlaceholder extends React.Component {
  render() {
    return (
      <View bg="light" flex={1} align="center" justify="center">
        <Spinner />
        <Text color="copy" weight="semibold" size="medium" mt={1}>
          Rescanning your transactions…
        </Text>
        <Text color="copy" weight="semibold" size="small" mt={0.5}>
          Some transaction may not be visible yet.
        </Text>
      </View>
    )
  }
}
