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
        disabledReason: PropTypes.string,
        address: PropTypes.string,
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

  state = { isOpen: false }

  toggleDropdown = () => {
    RN.LayoutAnimation.configureNext({
      duration: 200,
      create: {
        type: RN.LayoutAnimation.Types.easeIn,
        property: RN.LayoutAnimation.Properties.opacity
      },
      delete: {
        type: RN.LayoutAnimation.Types.easeIn,
        property: RN.LayoutAnimation.Properties.opacity
      }
    })
    this.setState(s => ({ ...s, isOpen: !s.isOpen }))
  }

  onOptionSelect = value => {
    this.setState({ isOpen: false }, () =>
      this.props.onChange({ id: this.props.id, value })
    )
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
        <RN.TouchableOpacity
          activeOpacity={0.9}
          disabled={this.props.disabled}
          onPress={this.toggleDropdown}
        >
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
        </RN.TouchableOpacity>
        <View style={styles.dropdownContainer} align="stretch">
          {this.state.isOpen && (
            <View style={styles.dropdown} py={0.5}>
              {this.props.options.map(i => (
                <RN.TouchableOpacity
                  activeOpacity={0.75}
                  disabled={Boolean(i.disabledReason)}
                  onPress={() => this.onOptionSelect(i.value)}
                  key={i.value}
                >
                  <View justify="space-between" align="baseline" row p={2}>
                    <Text
                      opacity={i.disabledReason ? 0.4 : 1}
                      weight="semibold"
                      color={this.props.value === i.value ? 'primary' : 'copy'}
                      size="medium"
                    >
                      {i.label}
                    </Text>
                    {i.disabledReason && (
                      <Text color="danger">{i.disabledReason}</Text>
                    )}
                  </View>
                </RN.TouchableOpacity>
              ))}
            </View>
          )}
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
  },
  dropdownContainer: {
    position: 'relative'
  },
  dropdown: {
    elevation: 3,
    backgroundColor: theme.colors.light,
    position: 'absolute',
    zIndex: 1,
    right: 0,
    left: 0
  }
})
