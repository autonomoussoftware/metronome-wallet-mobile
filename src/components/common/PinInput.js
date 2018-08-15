import { default as Svg, Path } from 'react-native-svg'
import { View, Text } from './index'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'

export const PIN_LENGTH = 6

const Feedback = ({ hasErrors, length }) => (
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

const Btn = ({ children, noBG, ...other }) => (
  <RN.TouchableOpacity activeOpacity={0.75} {...other}>
    <View
      opacity={other.disabled ? 0.5 : 1}
      style={[styles.btn, noBG && styles.noBG]}
      mx={1.25}
    >
      {typeof children === 'string' ? (
        <Text color="primary" size="xxLarge" weight="regular">
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  </RN.TouchableOpacity>
)

Btn.propTypes = {
  children: PropTypes.node.isRequired,
  noBG: PropTypes.bool
}

class PinInput extends React.Component {
  static propTypes = {
    shakeOnError: PropTypes.bool,
    onComplete: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.string.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ]),
    id: PropTypes.string.isRequired
  }

  state = { isShaking: false }

  onNumPress = val => {
    if (this.props.value.length >= PIN_LENGTH) return
    const newValue = this.props.value + val
    this.props.onChange({ id: this.props.id, value: newValue })
  }

  onDeletePress = () => {
    this.props.onChange({
      id: this.props.id,
      value: this.props.value.slice(0, this.props.value.length - 1)
    })
  }

  onClearPress = () => {
    this.props.onChange({ id: this.props.id, value: '' })
  }

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
    const { shakeOnError, disabled, value, error } = this.props
    const { isShaking } = this.state

    const shouldDisable = disabled || isShaking
    const hasErrors = error && error.length > 0

    return (
      <View>
        <RN.Animated.View style={this.shakeStyles}>
          <Feedback
            hasErrors={shakeOnError ? isShaking : hasErrors && !!value}
            length={value.length}
          />
        </RN.Animated.View>
        <View style={styles.errorPlaceholder} my={2}>
          {hasErrors && (
            <Text color="danger" size="small" align="center">
              {typeof error === 'string' ? error : error.join('. ')}
            </Text>
          )}
        </View>
        <View row justify="center">
          <Btn onPress={() => this.onNumPress('1')} disabled={shouldDisable}>
            1
          </Btn>
          <Btn onPress={() => this.onNumPress('2')} disabled={shouldDisable}>
            2
          </Btn>
          <Btn onPress={() => this.onNumPress('3')} disabled={shouldDisable}>
            3
          </Btn>
        </View>
        <View row justify="center" mt={2.5}>
          <Btn onPress={() => this.onNumPress('4')} disabled={shouldDisable}>
            4
          </Btn>
          <Btn onPress={() => this.onNumPress('5')} disabled={shouldDisable}>
            5
          </Btn>
          <Btn onPress={() => this.onNumPress('6')} disabled={shouldDisable}>
            6
          </Btn>
        </View>
        <View row justify="center" mt={2.5}>
          <Btn onPress={() => this.onNumPress('7')} disabled={shouldDisable}>
            7
          </Btn>
          <Btn onPress={() => this.onNumPress('8')} disabled={shouldDisable}>
            8
          </Btn>
          <Btn onPress={() => this.onNumPress('9')} disabled={shouldDisable}>
            9
          </Btn>
        </View>
        <View row justify="center" mt={2.5}>
          <View style={styles.placeholder} />
          <Btn onPress={() => this.onNumPress('0')} disabled={shouldDisable}>
            0
          </Btn>
          <Btn
            onLongPress={this.onClearPress}
            disabled={shouldDisable}
            onPress={this.onDeletePress}
            noBG
          >
            <Svg width="25" height="25" viewBox="0 0 48 48">
              <Path d="M0 0h48v48h-48z" fill="none" />
              <Path
                fill={theme.colors.primary}
                d="M44 6h-30c-1.38 0-2.47.7-3.19 1.76l-10.81 16.23 10.81 
                   16.23c.72 1.06 1.81 1.78 3.19 1.78h30c2.21 0 4-1.79
                   4-4v-28c0-2.21-1.79-4-4-4zm-6 25.17l-2.83 2.83-7.17-7.17-7.17
                   7.17-2.83-2.83 7.17-7.17-7.17-7.17 2.83-2.83 7.17 7.17
                   7.17-7.17 2.83 2.83-7.17 7.17 7.17 7.17z"
              />
            </Svg>
          </Btn>
        </View>
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
  placeholder: {
    height: 60,
    width: 80
  },
  btn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginHorizontal: theme.spacing(1.25),
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noBG: {
    backgroundColor: 'transparent'
  }
})

export default PinInput
