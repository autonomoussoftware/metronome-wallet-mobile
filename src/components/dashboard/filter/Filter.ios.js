import { View, BaseBtn } from '../../common'
import DropdownBtn from './DropdownBtn'
import PropTypes from 'prop-types'
import theme from '../../../theme'
import React from 'react'
import RN from 'react-native'

class Filter extends React.Component {
  static propTypes = {
    selectFilter: PropTypes.func.isRequired,
    options: PropTypes.objectOf(PropTypes.string).isRequired,
    filter: PropTypes.string.isRequired
  }

  state = { isOpen: false }

  toggleDropdown = () => {
    this.setState(s => ({ ...s, isOpen: !s.isOpen }))
  }

  onOptionSelect = key => {
    this.setState({ isOpen: false }, () => this.props.selectFilter(key))
  }

  render() {
    return (
      <View pr={1}>
        <RN.TouchableOpacity activeOpacity={0.9} onPress={this.toggleDropdown}>
          <DropdownBtn
            label={this.props.options[this.props.filter]}
            isOpen={this.state.isOpen}
          />
        </RN.TouchableOpacity>
        <View style={styles.dropdownContainer}>
          {this.state.isOpen && (
            <View style={styles.dropdown} align="flex-start">
              {Object.keys(this.props.options)
                .filter(key => this.props.filter !== key)
                .map(key => (
                  <BaseBtn
                    textProps={{ weight: 'semibold' }}
                    onPress={() => this.onOptionSelect(key)}
                    label={this.props.options[key]}
                    size="small"
                    key={key}
                    px={3}
                    py={1.5}
                  />
                ))}
            </View>
          )}
        </View>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  dropdownContainer: {
    position: 'relative'
  },
  dropdown: {
    backgroundColor: theme.colors.dark,
    borderRadius: 4,
    borderTopRightRadius: 0,
    position: 'absolute',
    right: 0.5,
    width: 150,
    alignItems: 'stretch'
  }
})

export default Filter
