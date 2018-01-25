import { ScrollView, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import settings from './config/settings';
import React from 'react';

export default class Debug extends React.Component {
  static propTypes = {
    screenProps: PropTypes.shape({
      seed: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView style={styles.container}>
          <Text>Debug information</Text>
          <View style={styles.panel}>
            <Text>Wallet seed:</Text>
            <Text>0x{this.props.screenProps.seed}</Text>
          </View>

          <View style={styles.panel}>
            <Text>Settings:</Text>
            <Text>{JSON.stringify(settings, null, 2)}</Text>
          </View>

          <View style={styles.panel}>
            <Text>props:</Text>
            <Text>{JSON.stringify(this.props, null, 2)}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1
  },
  container: {
    padding: 20
  },
  panel: {
    marginVertical: 20
  }
});
