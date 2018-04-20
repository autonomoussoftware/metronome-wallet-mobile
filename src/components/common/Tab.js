import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'
import Text from './Text'
import RN from 'react-native'

export default class Tab extends React.Component {
  static propTypes = {
    textProps: PropTypes.object,
    isActive: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired
  }

  render() {
    const { isActive, children, textProps, ...other } = this.props

    return (
      <RN.TouchableOpacity
        activeOpacity={0.75}
        style={[styles.container, isActive && styles.isActive]}
        {...other}
      >
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          opacity={this.props.isActive ? 1 : 0.75}
          align="center"
          color="light"
          {...textProps}
        >
          {children}
        </Text>
      </RN.TouchableOpacity>
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.darkShade,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexBasis: 0,
    paddingHorizontal: theme.spacing(1),
    paddingVertical: theme.spacing(2.5)
  },
  isActive: {
    borderBottomColor: theme.colors.primary,
    backgroundColor: theme.colors.translucentPrimary
  }
})
