import Svg, { Circle } from 'react-native-svg';
import theme from '../../theme';
import React from 'react';

export default class DotIcon extends React.Component {
  render() {
    return (
      <Svg viewBox="0 0 12 6" width="20" height="10" {...this.props}>
        <Circle
          stroke="transparent"
          fill={theme.colors.primary}
          cx="3"
          cy="3"
          r="2"
        />
      </Svg>
    );
  }
}
