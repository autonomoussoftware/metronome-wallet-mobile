import { spacing } from '../../utils'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'

const View = props => {
  const {
    withKeyboard,
    scrollProps,
    withHeader,
    children,
    innerRef,
    opacity,
    justify,
    rowwrap,
    align,
    shrink,
    scroll,
    basis,
    order,
    style,
    self,
    grow,
    flex,
    row,
    bg,
    ...other
  } = props

  const Component = scroll ? RN.ScrollView : RN.View

  const viewStyles = [
    opacity !== undefined && { opacity },
    shrink !== undefined && { flexShrink: shrink },
    basis !== undefined && { flexBasis: basis },
    order !== undefined && { order },
    grow !== undefined && { flexGrow: grow },
    flex !== undefined && { flex },
    justify && { justifyContent: justify },
    rowwrap && styles.rowwrap,
    align && { alignItems: align },
    self && { alignSelf: self },
    row && styles.row,
    bg && { backgroundColor: theme.colors[bg] },
    spacing(props),
    style
  ]

  if (withKeyboard) {
    return (
      <RN.KeyboardAvoidingView
        keyboardVerticalOffset={withHeader ? 64 : undefined}
        behavior={RN.Platform.OS === 'ios' ? 'padding' : undefined}
        style={[
          styles.keyboardAvoidingContainer,
          bg && { backgroundColor: theme.colors[bg] }
        ]}
      >
        <RN.ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          {...scrollProps}
        >
          <Component style={viewStyles} ref={innerRef} {...other}>
            {children}
          </Component>
        </RN.ScrollView>
      </RN.KeyboardAvoidingView>
    )
  }

  return (
    <Component style={viewStyles} ref={innerRef} {...other}>
      {children}
    </Component>
  )
}

View.propTypes = {
  withKeyboard: PropTypes.bool,
  withHeader: PropTypes.bool,
  justify: PropTypes.oneOf([
    'space-between',
    'space-around',
    'space-evenly',
    'flex-start',
    'flex-end',
    'center'
  ]),
  children: PropTypes.node,
  opacity: PropTypes.number,
  rowwrap: PropTypes.bool,
  shrink: PropTypes.number,
  scroll: PropTypes.bool,
  basis: PropTypes.number,
  order: PropTypes.number,
  align: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'baseline',
    'stretch',
    'center'
  ]),
  self: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'baseline',
    'stretch',
    'center'
  ]),
  style: PropTypes.any,
  grow: PropTypes.number,
  flex: PropTypes.number,
  bg: PropTypes.oneOf(Object.keys(theme.colors)),
  ...spacing.propTypes
}

const styles = RN.StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1
  },
  row: {
    flexDirection: 'row'
  },
  rowwrap: {
    flexWrap: 'wrap'
  },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 }
})

export default View
