import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { View } from '../common'

const PatternView = ({ children, ...other }) => (
  <View bg="dark" flex={1} {...other}>
    <RN.StatusBar backgroundColor="transparent" translucent />
    <RN.Image
      source={require('../../assets/images/pattern.png')}
      style={styles.bg}
    />
    {children}
  </View>
)

PatternView.propTypes = {
  children: PropTypes.node.isRequired
}

const styles = RN.StyleSheet.create({
  bg: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    right: 0
  }
})

export default PatternView
