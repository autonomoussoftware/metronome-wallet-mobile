import { StyleSheet, View, Text } from 'react-native';
import CountDownProvider from '../../providers/CountDownProvider';
import PropTypes from 'prop-types';
import theme from '../../config/theme';
import React from 'react';

export default class CountDown extends React.Component {
  static propTypes = {
    targetTimestamp: PropTypes.number.isRequired
  };

  render() {
    return (
      <CountDownProvider targetTimestamp={this.props.targetTimestamp}>
        {({ days, hours, minutes, seconds }) => (
          <View style={styles.container}>
            <View style={styles.cell}>
              <Text style={styles.number}>{days}</Text>
              <Text style={styles.label} numberOfLines={1}>
                DAYS
              </Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.number}>{hours}</Text>
              <Text style={styles.label} numberOfLines={1}>
                HOURS
              </Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.number}>{minutes}</Text>
              <Text style={styles.label} numberOfLines={1}>
                MINUTES
              </Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.number}>{seconds}</Text>
              <Text style={styles.label} numberOfLines={1}>
                SECONDS
              </Text>
            </View>
          </View>
        )}
      </CountDownProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bg.dark
  },
  cell: {
    flex: 1,
    padding: 5,
    alignItems: 'stretch'
  },
  number: {
    textAlign: 'center',
    color: theme.colors.primary,
    fontSize: theme.fonts.sizes.xLarge * 1.3
  },
  label: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: theme.fonts.sizes.xSmall,
    color: theme.colors.light
  }
});
