import PropTypes from 'prop-types'
import React from 'react'
import RN from 'react-native'

import { View, Text } from '../../../common'
import Caret from '../../../icons/CaretIcon'

export default class DropdownBtn extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    label: PropTypes.string.isRequired
  }

  static defaultProps = {
    isOpen: false
  }

  render() {
    const shouldCondenseLabel =
      ['RECEIVED', 'CONVERTED', 'AUCTION'].includes(this.props.label) &&
      RN.Dimensions.get('window').width < 375

    return (
      <View
        style={styles.container}
        align="center"
        row
        bg={this.props.isOpen ? 'dark' : 'transparent'}
        py={1.25}
        px={1}
      >
        <Text
          opacity={1}
          weight="semibold"
          shadow
          size={shouldCondenseLabel ? 'xSmall' : 'small'}
          ls={shouldCondenseLabel ? 0 : 1.4}
          mr={0.5}
        >
          {this.props.label}
        </Text>
        <Caret up={this.props.isOpen} />
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  container: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  }
})
