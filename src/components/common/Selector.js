import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'
import RN from 'react-native'

import SelectorCaret from '../icons/SelectorCaret'
import { Errors } from './TextInput'
import View from './View'
import Text from './Text'

export default class Selector extends React.Component {
  static propTypes = {
    topMargin: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })
    ).isRequired,
    error: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ]),
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    id: PropTypes.string.isRequired
  }

  onChange = e => {
    this.props.onChange({ id: this.props.id, value: e.target.value })
  }

  render() {
    const hasErrors = this.props.error && this.props.error.length > 0
    const activeItem = this.props.options.find(
      item => item.value === this.props.value
    )

    return (
      <RN.View
        style={[styles.container, this.props.topMargin && styles.topMargin]}
      >
        <View mb={0.5} row justify="space-between" align="center">
          <Text weight="semibold" ls={0.5} shadow style={styles.label}>
            {this.props.label}
          </Text>
        </View>
        <View
          justify="space-between"
          style={styles.field}
          align="center"
          row
          bg="translucentPrimary"
          px={2}
        >
          <Text size="medium">{activeItem ? activeItem.label : ''}</Text>
          <View opacity={this.props.disabled ? 0.25 : 1}>
            <SelectorCaret />
          </View>
        </View>
        <Errors hasErrors={hasErrors} message={this.props.error} />
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
  label: {
    fontSize: 13,
    lineHeight: 16
  },
  field: {
    minHeight: 56
  }
})
