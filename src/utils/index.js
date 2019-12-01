import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'
import RN from 'react-native'

/**
 * Wrapper function needed to fix an incompatibility between react-redux@7
 * and react-navigation@2
 *
 * @see https://stackoverflow.com/a/55805972/3498839
 *
 * @param {Object} Comp - A React component
 * @returns {Object} A wrapped React component
 */
export const wrapConnectedComponent = Comp => {
  const Wrapper = props => <Comp {...props} />
  Wrapper.displayName = `wrappedComponent(${Comp.displayName || Comp.name})`
  return Wrapper
}

export const errorPropTypes = (...fields) => {
  const shape = fields.reduce((acc, fieldName) => {
    acc[fieldName] = PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ])
    return acc
  }, {})
  return PropTypes.shape(shape).isRequired
}

// eslint-disable-next-line complexity
export const spacing = props => ({
  marginBottom: theme.spacing(props.m || props.mb || props.my || null),
  marginRight: theme.spacing(props.m || props.mr || props.mx || null),
  marginLeft: theme.spacing(props.m || props.ml || props.mx || null),
  marginTop: theme.spacing(props.m || props.mt || props.my || null),

  paddingBottom: theme.spacing(props.p || props.pb || props.py || null),
  paddingRight: theme.spacing(props.p || props.pr || props.px || null),
  paddingLeft: theme.spacing(props.p || props.pl || props.px || null),
  paddingTop: theme.spacing(props.p || props.pt || props.py || null)
})

spacing.propTypes = {
  m: PropTypes.number,
  mx: PropTypes.number,
  my: PropTypes.number,
  mt: PropTypes.number,
  mb: PropTypes.number,
  ml: PropTypes.number,
  mr: PropTypes.number,
  p: PropTypes.number,
  px: PropTypes.number,
  py: PropTypes.number,
  pt: PropTypes.number,
  pb: PropTypes.number,
  pl: PropTypes.number,
  pr: PropTypes.number
}

// Return proper fontFamily and fontWeight based on weight
// @see https://gist.github.com/hilkeheremans/acb9949a06ced38ba15a2628f849e33a
export function fontStyles(weight = 'regular') {
  return RN.Platform.select({
    ios: {
      fontFamily: 'Muli',
      fontWeight: theme.weights[weight].value
    },
    android: {
      fontFamily: theme.weights[weight].fileName,
      fontWeight: '400'
    }
  })
}
