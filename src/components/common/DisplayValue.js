// import theme from '../theme';
// import RN from 'react-native';
import { withClient } from '../../shared/hocs/clientContext';
import PropTypes from 'prop-types';
import React from 'react';
import Text from './Text';

class DisplayValue extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      fromWei: PropTypes.func.isRequired,
      toBN: PropTypes.func.isRequired
    }).isRequired,
    value: PropTypes.string,
    post: PropTypes.string,
    pre: PropTypes.string
    // maxDecimals: PropTypes.number,
    // maxSize: PropTypes.string,
    // inline: PropTypes.bool,
  };

  round(value) {
    let n = Number.parseFloat(this.props.client.fromWei(value), 10);
    let decimals = -Math.log10(n) + 10;
    if (decimals < 2) {
      decimals = 2;
    } else if (decimals >= 18) {
      decimals = 18;
    }
    // round extra decimals and remove trailing zeroes
    return this.props.client.toBN(n.toFixed(Math.ceil(decimals))).toString(10);
  }

  render() {
    const {
      value,
      post,
      pre,
      ...other
      // maxSize, inline
    } = this.props;

    let formattedValue;

    try {
      formattedValue = this.round(value);
    } catch (e) {
      formattedValue = null;
    }

    return (
      <Text numberOfLines={1} adjustsFontSizeToFit {...other}>
        {pre}
        {formattedValue || '?'}
        {post}
      </Text>
    );
  }
}

// const styles = RN.StyleSheet.create({
//   container: {}
// });

export default withClient(DisplayValue);
