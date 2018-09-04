import { View, Text } from './index'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'

export const PIN_LENGTH = 6

export const Feedback = ({ hasErrors, length }) => (
  <View row justify="center">
    {Array.from(Array(PIN_LENGTH)).map((_, i) => (
      <View
        justify="center"
        align="center"
        style={[
          styles.cell,
          length > i && !hasErrors && styles.cellCompleted,
          hasErrors && styles.cellError
        ]}
        key={i}
        mx={0.5}
      >
        <View
          style={[
            styles.dot,
            length > i && !hasErrors && styles.dotCompleted,
            hasErrors && styles.dotError
          ]}
        />
      </View>
    ))}
  </View>
)

Feedback.propTypes = {
  hasErrors: PropTypes.bool,
  length: PropTypes.number.isRequired
}

class PinInput extends React.Component {
  static propTypes = {
    shakeOnError: PropTypes.bool,
    onComplete: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    error: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ]),
    id: PropTypes.string.isRequired
  }

  state = { isShaking: false }

  pinInput = null

  componentDidUpdate(prevProps) {
    const { shakeOnError, onComplete, value, error } = this.props

    if (prevProps.value !== value && value.length >= PIN_LENGTH && onComplete) {
      onComplete()
    }

    if (shakeOnError && prevProps.error !== error && error) {
      this.shake()
    }
  }

  shakePosition = new RN.Animated.Value(0)

  shake() {
    this.shakePosition.setValue(0)
    this.setState({ isShaking: true })
    RN.Animated.timing(this.shakePosition, {
      useNativeDriver: true,
      duration: 600,
      toValue: 1
    }).start(() => this.setState({ isShaking: false }))
  }

  shakeStyles = {
    transform: [
      {
        translateX: this.shakePosition.interpolate({
          inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
          outputRange: [0, -10, 10, -10, 10, 0]
        })
      }
    ]
  }

  render() {
    const { shakeOnError, value, error, onChange, label, id } = this.props
    const { isShaking } = this.state

    const hasErrors = error && error.length > 0

    return (
      <View>
        {label && (
          <Text align="center" size="large" weight="bold" mb={2}>
            {label}
          </Text>
        )}
        <RN.Animated.View style={this.shakeStyles}>
          <RN.TouchableOpacity
            activeOpacity={0.91}
            onPress={() => (this.pinInput ? this.pinInput.focus() : null)}
          >
            <Feedback
              hasErrors={shakeOnError ? isShaking : hasErrors && !!value}
              length={value.length}
            />
          </RN.TouchableOpacity>
        </RN.Animated.View>
        <View style={styles.errorPlaceholder} my={2}>
          {hasErrors && (
            <Text color="danger" size="small" align="center">
              {typeof error === 'string' ? error : error.join('. ')}
            </Text>
          )}
        </View>
        <RN.TextInput
          keyboardAppearance="dark"
          textContentType="password"
          secureTextEntry
          onChangeText={newValue => onChange({ id, value: newValue })}
          keyboardType="number-pad"
          caretHidden
          maxLength={PIN_LENGTH}
          autoFocus
          style={styles.hiddenInput}
          value={value || ''}
          ref={ref => {
            this.pinInput = ref
          }}
        />
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  cell: {
    borderRadius: 8,
    borderWidth: 2,
    height: 56,
    width: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: theme.colors.light
  },
  cellCompleted: {
    backgroundColor: theme.colors.light,
    borderColor: theme.colors.lightBG
  },
  cellError: {
    backgroundColor: theme.colors.light,
    borderColor: theme.colors.lightBG
  },
  dot: {
    borderRadius: 8,
    borderWidth: 1,
    height: 8,
    width: 8,
    backgroundColor: theme.colors.lightBG,
    borderColor: theme.colors.lightShade
  },
  dotCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  dotError: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger
  },
  errorPlaceholder: { height: 18 },
  hiddenInput: {
    opacity: 0,
    height: 0
  }
})

export default PinInput
