import withSendDrawerState from 'metronome-wallet-ui-logic/src/hocs/withSendDrawerState'
import PropTypes from 'prop-types'
import React from 'react'

import { BaseBtn, View, Text, Tab } from '../common'
import SendETHForm from './SendETHForm'
import SendMETForm from './SendMETForm'

const DEFAULT_TAB = 'eth'

class SendDrawer extends React.Component {
  static propTypes = {
    sendMetDisabledReason: PropTypes.string,
    sendMetDisabled: PropTypes.bool.isRequired
  }

  state = { activeTab: DEFAULT_TAB }

  render() {
    return (
      <View bg="dark" flex={1}>
        <View row>
          <Tab
            isActive={this.state.activeTab === 'eth'}
            onPress={() => this.setState({ activeTab: 'eth' })}
          >
            ETH
          </Tab>
          <Tab
            isActive={this.state.activeTab === 'met'}
            onPress={() => this.setState({ activeTab: 'met' })}
          >
            MET
          </Tab>
        </View>
        <View withKeyboard withHeader flex={1}>
          {this.state.activeTab === 'eth' && <SendETHForm key="a" />}
          {this.state.activeTab === 'met' &&
            (this.props.sendMetDisabled ? (
              <View flex={1} align="center" justify="center">
                <Text opacity={0.7}>{this.props.sendMetDisabledReason}</Text>
              </View>
            ) : (
              <SendMETForm key="b" />
            ))}
        </View>
      </View>
    )
  }
}

const EnhancedComponent = withSendDrawerState(SendDrawer)

EnhancedComponent.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Send',
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
