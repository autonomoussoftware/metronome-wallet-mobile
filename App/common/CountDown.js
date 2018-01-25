import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import theme from '../config/theme';
import React from 'react';
import 'moment-precise-range-plugin';

export default class CountDown extends React.Component {
  static propTypes = {
    targetTimestamp: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = this.getCountdownValues(props.targetTimestamp);
  }

  componentDidMount() {
    this.intervalId = window.setInterval(this.updateCountdown, 1000);
  }

  componentWillUnmount() {
    if (this.intervalId) window.clearInterval(this.intervalId);
  }

  updateCountdown = () => {
    this.setState(this.getCountdownValues(this.props.targetTimestamp));
  };

  getCountdownValues = targetTime => {
    return moment.preciseDiff(moment.unix(targetTime), moment(), true);
  };

  render() {
    const { days, hours, minutes, seconds } = this.state;
    return (
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
