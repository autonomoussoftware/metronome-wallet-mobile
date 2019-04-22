import withConvertDrawerState from 'metronome-wallet-ui-logic/src/hocs/withConvertDrawerState'
import PropTypes from 'prop-types'
import React from 'react'

import { BaseBtn, View, Tab, Text } from '../common'
import ConvertCoinToMETForm from './ConvertCoinToMETForm'
import ConvertMETtoCoinForm from './ConvertMETtoCoinForm'

const DEFAULT_TAB = 'coin'

class ConvertDrawer extends React.Component {
  static propTypes = {
    coinSymbol: PropTypes.string.isRequired
  }

  state = { activeTab: DEFAULT_TAB }

  render() {
    return (
      <View bg="dark" flex={1} justify="space-between">
        <View row>
          <Tab
            isActive={this.state.activeTab === 'coin'}
            onPress={() => this.setState({ activeTab: 'coin' })}
          >
            {this.props.coinSymbol} <Text color="primary">&rarr;</Text> MET
          </Tab>
          <Tab
            isActive={this.state.activeTab === 'met'}
            onPress={() => this.setState({ activeTab: 'met' })}
          >
            MET <Text color="primary">&rarr;</Text> {this.props.coinSymbol}
          </Tab>
        </View>

        <View withKeyboard withHeader flex={1}>
          {this.state.activeTab === 'coin' && <ConvertCoinToMETForm />}
          {this.state.activeTab === 'met' && <ConvertMETtoCoinForm />}
        </View>
      </View>
    )
  }
}

const EnhancedComponent = withConvertDrawerState(ConvertDrawer)

EnhancedComponent.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Convert',
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
