import { View, Text } from '../common'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'
import RN from 'react-native'

export default class EntropyMeter extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    ratio: PropTypes.number.isRequired,
    hue: PropTypes.number.isRequired
  }

  ratio = new RN.Animated.Value(0)

  color = ratio =>
    ratio >= 1
      ? theme.colors.success
      : ratio >= 0.75
        ? 'hsla(40, 100%, 50%, 0.75)'
        : theme.colors.danger

  componentDidMount() {
    this.animateBar()
  }

  componentDidUpdate({ ratio }) {
    if (ratio !== this.props.ratio) this.animateBar()
  }

  animateBar = () => {
    RN.Animated.spring(this.ratio, {
      toValue: this.props.ratio
    }).start()
  }

  render() {
    return (
      <View style={styles.container}>
        <RN.Animated.View
          style={[
            styles.bar,
            this.props.ratio >= 1 && styles.glow,
            {
              backgroundColor: `hsl(${this.props.hue}, 62%, 55%)`,
              width: this.ratio.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp'
              })
            }
          ]}
        />

        <Text
          align="right"
          style={[styles.message, { color: this.color(this.props.ratio) }]}
        >
          {this.props.message}
        </Text>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: 22,
    marginTop: -22
  },
  bar: {
    height: 2
  },
  glow: {
    shadowRadius: 4,
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1
  },
  message: {
    lineHeight: 18,
    fontSize: 14
  }
})
