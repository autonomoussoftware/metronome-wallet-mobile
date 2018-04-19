import { pageStatusPropTypes } from '../../utils';
import ConvertETHtoMETForm from './ConvertETHtoMETForm';
import ConvertMETtoETHForm from './ConvertMETtoETHForm';
import { View, Tab, Text } from '../common';
import React from 'react';

const DEFAULT_TAB = 'eth';

class ConvertDrawer extends React.Component {
  static propTypes = {
    ...pageStatusPropTypes
  };

  state = { activeTab: DEFAULT_TAB };

  componentDidUpdate(prevProps) {
    if (
      this.props.pageStatus === 'offscreen' &&
      prevProps.pageStatus !== 'offscreen'
    ) {
      this.setState({ activeTab: DEFAULT_TAB });
    }
  }

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
          {this.state.activeTab === 'eth' && (
            <ConvertETHtoMETForm pageStatus={this.props.pageStatus} />
          )}
          {this.state.activeTab === 'met' && (
            <ConvertMETtoETHForm pageStatus={this.props.pageStatus} />
          )}
        </View>
      </View>
    );
  }
}

export default ConvertDrawer;
