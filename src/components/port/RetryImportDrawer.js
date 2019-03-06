import withRetryImportFormState from 'metronome-wallet-ui-logic/src/hocs/withRetryImportFormState'
// import PropTypes from 'prop-types'
import React from 'react'

import { BaseBtn, View, Text } from '../common'

class RetryImportDrawer extends React.Component {
  static propTypes = {
    // coinSymbol: PropTypes.string.isRequired
  }

  render() {
    return (
      <View bg="dark" flex={1} justify="space-between">
        <View withKeyboard withHeader flex={1}>
          <Text>Retry Import Drawer</Text>
        </View>
      </View>
    )
  }
}

const EnhancedComponent = withRetryImportFormState(RetryImportDrawer)

EnhancedComponent.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Retry Metronome Import',
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
