import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { View, Text } from '../common'
import PinInput from '../common/PinInput'

export default class PinStep extends React.Component {
  static propTypes = {
    onInputChange: PropTypes.func.isRequired,
    password: PropTypes.string
  }

  render() {
    return (
      <View flex={1} align="center" px={2} pb={10} justify="center">
        <Text size="large" weight="semibold" mb={2}>
          Define a PIN
        </Text>
        <RN.View style={styles.bigPlaceholder} mb={4}>
          <Text size="medium" align="center" px={4}>
            All data will be encrypted using this PIN. Don&apos;t lose it.
          </Text>
        </RN.View>
        <PinInput
          onChange={this.props.onInputChange}
          testID="password"
          value={this.props.password || ''}
          id="password"
        />
        <View style={styles.placeholder} />
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  placeholder: {
    height: 50
  },
  bigPlaceholder: {
    height: 70
  }
})
