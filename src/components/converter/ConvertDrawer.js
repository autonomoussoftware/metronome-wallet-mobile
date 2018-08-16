import { BaseBtn, View, Tab, Text } from '../common'
import ConvertETHtoMETForm from './ConvertETHtoMETForm'
import ConvertMETtoETHForm from './ConvertMETtoETHForm'
import React from 'react'

const DEFAULT_TAB = 'eth'

class ConvertDrawer extends React.Component {
  state = { activeTab: DEFAULT_TAB }

  render() {
    return (
      <View bg="dark" flex={1} justify="space-between">
        <View row>
          <Tab
            isActive={this.state.activeTab === 'eth'}
            onPress={() => this.setState({ activeTab: 'eth' })}
          >
            ETH <Text color="primary">&rarr;</Text> MET
          </Tab>
          <Tab
            isActive={this.state.activeTab === 'met'}
            onPress={() => this.setState({ activeTab: 'met' })}
          >
            MET <Text color="primary">&rarr;</Text> ETH
          </Tab>
        </View>

        <View grow={1} flex={1}>
          {this.state.activeTab === 'eth' && <ConvertETHtoMETForm />}
          {this.state.activeTab === 'met' && <ConvertMETtoETHForm />}
        </View>
      </View>
    )
  }
}

ConvertDrawer.navigationOptions = ({ navigation }) => ({
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

export default ConvertDrawer
