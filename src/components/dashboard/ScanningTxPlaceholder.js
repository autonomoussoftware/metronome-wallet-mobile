import { View, Text } from '../common'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'

export default class ScanningTxPlaceholder extends React.Component {
  render() {
    return (
      <View bg="light" flex={1} align="center" justify="center">
        <RN.ActivityIndicator size="small" color={theme.colors.primary} />
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
