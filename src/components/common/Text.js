import { StyleSheet, Text as RNText } from 'react-native'
import { spacing } from '../../utils'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'

const Text = props => {
  const {
    children,
    opacity,
    weight,
    shadow,
    style,
    color,
    align,
    size,
    ls: letterSpacing,
    ...other
  } = props

  return (
    <RNText
      style={[
        styles.container,
        { fontWeight: theme.weights[weight || 'regular'] },
        letterSpacing !== undefined && { letterSpacing },
        opacity !== undefined && { opacity },
        shadow && styles.shadow,
        color && { color: theme.colors[color] },
        align && { textAlign: align },
        size && { fontSize: theme.sizes[size] },
        spacing(props),
        style
      ]}
      {...other}
    >
      {children}
    </RNText>
  )
}

Text.propTypes = {
  children: PropTypes.node.isRequired,
  opacity: PropTypes.number,
  weight: PropTypes.oneOf([
    'xlight',
    'light',
    'regular',
    'semibold',
    'bold',
    'bold',
    'xbold',
    'black'
  ]),
  shadow: PropTypes.bool,
  color: PropTypes.oneOf(Object.keys(theme.colors)),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  style: PropTypes.any,
  size: PropTypes.oneOf(Object.keys(theme.sizes)),
  ls: PropTypes.number,
  ...spacing.propTypes
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Muli',
    color: theme.colors.light
  },
  shadow: {
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    textShadowColor: theme.colors.darkShade
  }
})

export default Text
