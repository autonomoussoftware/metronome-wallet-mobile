import withPortState from 'metronome-wallet-ui-logic/src/hocs/withPortState'
import PropTypes from 'prop-types'
import React from 'react'

import { MenuBtn, View, Btn } from '../common'

class Port extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const { navigation } = this.props

    return (
      <View bg="dark" flex={1} px={2} py={4} justify="space-between">
        <Btn
          onPress={() => navigation.navigate('PortDrawer')}
          label="Port"
          block
        />
      </View>
    )
  }
}

const EnhancedComponent = withPortState(Port)

EnhancedComponent.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Port',
  headerBackTitle: null,
  headerLeft: <MenuBtn onPress={navigation.openDrawer} />
})

export default EnhancedComponent
