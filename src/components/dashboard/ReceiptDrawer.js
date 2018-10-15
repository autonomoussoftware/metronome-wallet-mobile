import { BaseBtn } from '../common'
import PropTypes from 'prop-types'
import Receipt from '../common/Receipt'
import React from 'react'

export default class ReceiptDrawer extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          hash: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Transaction Receipt',
    headerRight: (
      <BaseBtn
        textProps={{ weight: 'semibold', size: 'medium' }}
        onPress={navigation.getParam('onHeaderRightPress', null)}
        label="Refresh"
        mr={1}
      />
    )
  })

  render() {
    return (
      <Receipt
        navigation={this.props.navigation}
        hash={this.props.navigation.state.params.hash}
      />
    )
  }
}
