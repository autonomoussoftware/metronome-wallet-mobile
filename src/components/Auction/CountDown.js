import CountDownProvider from '../../shared/hocs/CountDownProvider';
import { Text, View } from '../common';
import PropTypes from 'prop-types';
import theme from '../../theme';
import React from 'react';
import RN from 'react-native';

export default class CountDown extends React.Component {
  static propTypes = {
    targetTimestamp: PropTypes.number.isRequired
  };

  render() {
    const { targetTimestamp } = this.props;

    return (
      <CountDownProvider targetTimestamp={targetTimestamp}>
        {({ days, hours, minutes, seconds, inFuture }) =>
          inFuture ? (
            <View row bg="lightShade">
              <Cell number={days} label="DAYS" isFaded={days === 0} isFirst />
              <Cell number={hours} label="HOURS" isFaded={days + hours === 0} />
              <Cell
                number={minutes}
                label="MINUTES"
                isFaded={days + hours + minutes === 0}
              />
              <Cell
                number={seconds}
                label="SECS"
                isFaded={days + hours + minutes + seconds === 0}
              />
            </View>
          ) : (
            <View>
              <Text color="primary" size="medium" my={4} align="center">
                Waiting to confirm auction start...
              </Text>
            </View>
          )
        }
      </CountDownProvider>
    );
  }
}

const Cell = ({ number, label, isFaded, isFirst }) => (
  <View style={[styles.cell, isFirst && styles.isFirst]}>
    <Text size="xxLarge" color="primary" opacity={isFaded ? 0.7 : 1}>
      {number}
    </Text>
    <Text size="small" color="primary" opacity={isFaded ? 0.7 : 1}>
      {label}
    </Text>
  </View>
);

Cell.propTypes = {
  isFaded: PropTypes.bool.isRequired,
  isFirst: PropTypes.bool,
  number: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired
};

const styles = RN.StyleSheet.create({
  cell: {
    flexBasis: 0,
    flexGrow: 1,
    alignItems: 'center',
    padding: theme.spacing(1),
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.darkShade
  },
  isFirst: {
    borderLeftColor: 'transparent'
  }
});
