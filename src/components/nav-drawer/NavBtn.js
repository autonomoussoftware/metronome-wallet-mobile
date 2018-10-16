import { TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'

import { View, Text } from '../common'

const NavBtn = ({ label, isFirst, IconComponent, isActive, ...other }) => (
  <TouchableOpacity activeOpacity={0.5} {...other}>
    <View
      style={[
        styles.btn,
        isFirst && styles.btnFirst,
        isActive && styles.btnActive
      ]}
      align="center"
      row
      px={2}
      py={3}
    >
      <IconComponent isActive={!!isActive} />
      <Text
        opacity={isActive ? 1 : 0.65}
        weight="semibold"
        color="light"
        size="medium"
        ls={1.6}
        ml={2}
      >
        {label}
      </Text>
    </View>
  </TouchableOpacity>
)

NavBtn.propTypes = {
  IconComponent: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  isFirst: PropTypes.bool,
  label: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  btn: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.darkShade
  },
  btnFirst: {
    borderTopColor: theme.colors.darkShade,
    borderTopWidth: 2
  },
  btnActive: {
    borderBottomColor: theme.colors.primary,
    backgroundColor: theme.colors.translucentPrimary
  }
})

export default NavBtn
