import PropTypes from 'prop-types'
import theme from '../../theme'
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
      <RN.Picker
        onValueChange={this.props.selectFilter}
        selectedValue={this.props.filter}
        style={[
          styles.container,
          { width: this.props.filter.length * 10 + 65 }
        ]}
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
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    height: 30,
    color: theme.colors.light
  }
})

export default Filter
