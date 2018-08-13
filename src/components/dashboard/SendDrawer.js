import withSendDrawerState from '../../shared/hocs/withSendDrawerState'
import { View, Text, Tab } from '../common'
import SendETHForm from './SendETHForm'
import SendMETForm from './SendMETForm'
import PropTypes from 'prop-types'
import React from 'react'

const DEFAULT_TAB = 'eth'

class SendDrawer extends React.Component {
  static propTypes = {
    sendMetDisabledReason: PropTypes.string,
    sendMetDisabled: PropTypes.bool.isRequired
  }

  state = { activeTab: DEFAULT_TAB }

  render() {
    return (
      <View bg="dark" flex={1} justify="space-between">
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

        <View grow={1} flex={1}>
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

export default withSendDrawerState(SendDrawer)
