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
        style={[styles.cell, length > i && styles.cellCompleted]}
        key={i}
        mx={0.5}
      >
        <View
          style={[
            styles.dot,
            length > i && styles.dotCompleted,
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
    <RN.View style={[styles.btn, noBG && styles.noBG]}>
      {typeof children === 'string' ? (
        <Text color="primary" size="xxLarge" weight="regular">
          {children}
        </Text>
      ) : (
        children
      )}
    </RN.View>
  </RN.TouchableOpacity>
)

Btn.propTypes = {
  children: PropTypes.node.isRequired,
  noBG: PropTypes.bool
}

class PinInput extends React.Component {
  static propTypes = {
    onComplete: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ]),
    id: PropTypes.string.isRequired
  }

  onDeletePress = () => {
    this.props.onChange({
      id: this.props.id,
      value: this.props.value.slice(0, this.props.value.length - 1)
    })
  }

  onNumPress = val => {
    const newValue = this.props.value + val
    this.props.onChange({ id: this.props.id, value: newValue })
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.value !== this.props.value &&
      this.props.value.length >= PIN_LENGTH &&
      this.props.onComplete
    ) {
      this.props.onComplete()
    }
  }

  render() {
    const { value = '', error } = this.props

    const hasErrors = error && error.length > 0

    return (
      <View>
        <Feedback length={value.length} hasErrors={hasErrors} />
        <View style={{ height: 16 }} my={2}>
          {hasErrors && (
            <Text color="danger" size="small" align="center">
              {typeof error === 'string' ? error : error.join('. ')}
            </Text>
          )}
        </View>
        <View row justify="center">
          <Btn onPress={() => this.onNumPress('1')}>1</Btn>
          <Btn onPress={() => this.onNumPress('2')}>2</Btn>
          <Btn onPress={() => this.onNumPress('3')}>3</Btn>
        </View>
        <View row justify="center" mt={2.5}>
          <Btn onPress={() => this.onNumPress('4')}>4</Btn>
          <Btn onPress={() => this.onNumPress('5')}>5</Btn>
          <Btn onPress={() => this.onNumPress('6')}>6</Btn>
        </View>
        <View row justify="center" mt={2.5}>
          <Btn onPress={() => this.onNumPress('7')}>7</Btn>
          <Btn onPress={() => this.onNumPress('8')}>8</Btn>
          <Btn onPress={() => this.onNumPress('9')}>9</Btn>
        </View>
        <View row justify="center" mt={2.5}>
          <View style={styles.placeholder} />
          <Btn onPress={() => this.onNumPress('0')}>0</Btn>
          <Btn onPress={this.onDeletePress} noBG>
            <Svg width="25" height="25" viewBox="0 0 48 48">
              <Path d="M0 0h48v48h-48z" fill="none" />
              <Path
                fill={theme.colors.primary}
                d="M44 6h-30c-1.38 0-2.47.7-3.19 1.76l-10.81 16.23 10.81 16.23c.72 1.06 1.81 1.78 3.19 1.78h30c2.21 0 4-1.79 4-4v-28c0-2.21-1.79-4-4-4zm-6 25.17l-2.83 2.83-7.17-7.17-7.17 7.17-2.83-2.83 7.17-7.17-7.17-7.17 2.83-2.83 7.17 7.17 7.17-7.17 2.83 2.83-7.17 7.17 7.17 7.17z"
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
