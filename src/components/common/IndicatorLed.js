import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'
import RN from 'react-native'

import View from './View'

export default function IndicatorLed({ color }) {
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors[color] }]}
    />
  )
}

IndicatorLed.propTypes = {
  color: PropTypes.oneOf(Object.keys(theme.colors))
}

const styles = RN.StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: theme.colors.light,
    borderWidth: 1,
    marginLeft: 3,
    height: 10,
    width: 10
  }
})
