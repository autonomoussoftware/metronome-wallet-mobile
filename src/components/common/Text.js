import { fontStyles, spacing } from '../../utils'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'

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
    <RN.Text
      style={[
        styles.container,
        fontStyles(weight),
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
    </RN.Text>
  )
}

Text.propTypes = {
  children: PropTypes.node.isRequired,
  opacity: PropTypes.number,
  weight: PropTypes.oneOf(Object.keys(theme.weights)),
  shadow: PropTypes.bool,
  color: PropTypes.oneOf(Object.keys(theme.colors)),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  style: PropTypes.any,
  size: PropTypes.oneOf(Object.keys(theme.sizes)),
  ls: PropTypes.number,
  ...spacing.propTypes
}

const styles = RN.StyleSheet.create({
  container: {
    color: theme.colors.light
  },
  shadow: {
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    textShadowColor: theme.colors.darkShade
  }
})

export default Text
