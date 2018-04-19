import { StyleSheet, Text as RNText } from 'react-native';
import { spacing, sizes } from '../../utils';
import PropTypes from 'prop-types';
import theme from '../../theme';
import React from 'react';

const Text = props => {
  const { opacity, style, children, color, align, ...other } = props;

  return (
    <RNText
      style={[
        styles.container,
        opacity !== undefined && { opacity: opacity },
        color && { color: theme.colors[color] },
        align && { textAlign: align },
        spacing(props),
        sizes(props),
        style
      ]}
      {...other}
    >
      {children}
    </RNText>
  );
};

Text.propTypes = {
  children: PropTypes.node.isRequired,
  opacity: PropTypes.number,
  color: PropTypes.oneOf(Object.keys(theme.colors)),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  style: PropTypes.any,
  ...spacing.propTypes,
  ...sizes.propTypes
};

const styles = StyleSheet.create({
  container: {
    color: theme.colors.light
  }
});

export default Text;
