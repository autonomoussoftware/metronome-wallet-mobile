import DropdownBtn from './DropdownBtn'
import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

class Filter extends React.Component {
  static propTypes = {
    selectFilter: PropTypes.func.isRequired,
    options: PropTypes.objectOf(PropTypes.string).isRequired,
    filter: PropTypes.string.isRequired
  }

  render() {
    return (
      <RN.View style={styles.container}>
        <DropdownBtn label={this.props.options[this.props.filter]} />
        <RN.Picker
          onValueChange={this.props.selectFilter}
          selectedValue={this.props.filter}
          style={styles.hiddenPicker}
          mode="dialog"
        >
          {Object.keys(this.props.options).map(key => (
            <RN.Picker.Item
              label={this.props.options[key]}
              value={key}
              key={key}
            />
          ))}
        </RN.Picker>
      </RN.View>
    )
  }
}

const styles = RN.StyleSheet.create({
  /**
   * Native Android picker is not customizable enough so we hide it
   * and cover it with a custom dropdown button.
   * @see https://github.com/facebook/react-native/issues/7817#issuecomment-264851951
   */
  container: {
    borderWidth: 0
  },
  hiddenPicker: {
    position: 'absolute',
    height: 1000,
    width: 1000,
    top: 0
  }
})

export default Filter
