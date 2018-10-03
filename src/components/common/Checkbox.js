import SVG, { Path, Rect } from 'react-native-svg'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'
import View from './View'
import Text from './Text'
import RN from 'react-native'

export default class Checkbox extends React.Component {
  static propTypes = {
    'data-testid': PropTypes.string,
    topMargin: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    error: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ]),
    label: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired
  }

  render() {
    const {
      topMargin,
      disabled,
      onChange,
      checked,
      error,
      label,
      id,
      ...other
    } = this.props

    const hasErrors = error && error.length > 0

    return (
      <View style={styles.container} mt={topMargin ? 2 : 0} {...other}>
        <View row align="flex-start">
          <View mr={1.5}>
            <RN.TouchableOpacity
              activeOpacity={0.8}
              disabled={disabled}
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              onPress={() => onChange({ id, value: !checked })}
            >
              <SVG viewBox="0 0 16 16" height="20" width="20">
                <Rect fill="white" width="100%" height="100%" rx="4" />
                {checked && (
                  <Path
                    fill={theme.colors.primary}
                    d="M5.867 10.603L3.533 8.27a.656.656 0 0 0-.933 0 .656.656 0 0 0 0 .933l2.793 2.794c.26.26.68.26.94 0l7.067-7.06a.656.656 0 0 0 0-.934.656.656 0 0 0-.933 0l-6.6 6.6z"
                  />
                )}
              </SVG>
            </RN.TouchableOpacity>
          </View>
          <View shrink={1}>
            <Text weight="semibold" ls={0.5} shadow size="small">
              {label}
            </Text>
          </View>
        </View>
        <RN.View style={styles.errorContainer}>
          {hasErrors && (
            <Text style={styles.errorText} color="danger">
              {typeof error === 'string' ? error : error.join('. ')}
            </Text>
          )}
        </RN.View>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    width: '100%'
  },
  errorContainer: {
    paddingVertical: 2,
    minHeight: 22
  },
  errorText: {
    lineHeight: 18,
    fontSize: 14,
    textAlign: 'right'
  }
})
