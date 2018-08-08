import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'
import Text from './Text'
import RN from 'react-native'

export default class TextInput extends React.Component {
  static propTypes = {
    'data-testid': PropTypes.string,
    placeholder: PropTypes.string,
    postLabel: PropTypes.element,
    topMargin: PropTypes.bool,
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    noFocus: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    error: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ]),
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    type: PropTypes.oneOf(['text', 'number', 'password', 'url']),
    cols: PropTypes.number,
    id: PropTypes.string.isRequired
  }

  state = { isFocused: false }

  onFocus = () => {
    this.setState({ isFocused: true })
    if (this.props.onFocus) this.props.onFocus()
  }

  onBlur = () => {
    this.setState({ isFocused: false })
    if (this.props.onBlur) this.props.onBlur()
  }

  render() {
    const {
      topMargin,
      postLabel,
      onChange,
      noFocus,
      error,
      label,
      value,
      id,
      ...other
    } = this.props

    const { isFocused } = this.state
    const hasErrors = error && error.length > 0

    return (
      <RN.View style={[styles.container, topMargin && styles.topMargin]}>
        <RN.View style={styles.labelContainer}>
          <Text weight="semibold" ls={0.5} shadow style={styles.label}>
            {label}
          </Text>
          {postLabel}
        </RN.View>
        <RN.View style={styles.fieldContainer}>
          <RN.TextInput
            placeholderTextColor="#888"
            allowFontScaling
            autoCapitalize="none"
            onChangeText={newValue => onChange({ id, value: newValue })}
            autoCorrect={false}
            spellCheck={false}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            style={[
              styles.field,
              isFocused && styles.isFocused,
              noFocus && value && value.length > 0 && styles.noFocus,
              hasErrors && styles.hasErrors,
              { minHeight: 28 * (other.numberOfLines || 2) }
            ]}
            value={value || ''}
            {...other}
          />
        </RN.View>
        <RN.View style={styles.errorContainer}>
          {hasErrors && (
            <Text style={styles.errorText} color="danger">
              {typeof error === 'string' ? error : error.join('. ')}
            </Text>
          )}
        </RN.View>
      </RN.View>
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    width: '100%'
  },
  topMargin: {
    marginTop: theme.spacing(2)
  },
  labelContainer: {
    marginBottom: 4,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    fontSize: 13,
    lineHeight: 16
  },
  fieldContainer: {
    backgroundColor: theme.colors.translucentPrimary
  },
  field: {
    fontSize: 16,
    paddingHorizontal: theme.spacing(2),
    color: theme.colors.light,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.transparent
  },
  isFocused: {
    borderBottomColor: theme.colors.primary
  },
  hasErrors: {
    borderBottomColor: theme.colors.danger
  },
  errorContainer: {
    paddingVertical: 2,
    minHeight: 22
  },
  errorText: {
    lineHeight: 18,
    fontSize: 14,
    textAlign: 'right'
  },
  noFocus: {
    borderBottomColor: theme.colors.transparent
  }
})
