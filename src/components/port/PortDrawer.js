import withPortFormState from 'metronome-wallet-ui-logic/src/hocs/withPortFormState'
// import PropTypes from 'prop-types'
import React from 'react'

import { BaseBtn, View, Text } from '../common'

class PortDrawer extends React.Component {
  static propTypes = {
    // coinSymbol: PropTypes.string.isRequired
  }

  render() {
    return (
      <View bg="dark" flex={1} justify="space-between">
        <View withKeyboard withHeader flex={1}>
          <Text>Port Metronome Drawer</Text>
        </View>
      </View>
    )
  }
}

const EnhancedComponent = withPortFormState(PortDrawer)

EnhancedComponent.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Port Metronome',
  headerBackTitle: null,
  headerRight: (
    <BaseBtn
      textProps={{ weight: 'semibold', size: 'medium' }}
      onPress={navigation.getParam('onHeaderRightPress', null)}
      label="Review"
      mr={1}
    />
  )
})

export default EnhancedComponent
