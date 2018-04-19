import { StyleSheet, Platform, View as RNView } from 'react-native';
import { spacing } from '../../utils';
import PropTypes from 'prop-types';
import theme from '../../theme';
import React from 'react';

const isOldIOS = Platform.OS === 'ios' && parseFloat(Platform.Version) < 11;

const View = props => {
  const {
    children,
    opacity,
    justify,
    rowwrap,
    align,
    shrink,
    basis,
    order,
    style,
    grow,
    flex,
    safe,
    row,
    bg,
    ...other
  } = props;

  return (
    <RNView
      style={[
        opacity !== undefined && { opacity: opacity },
        shrink !== undefined && { flexShrink: shrink },
        basis !== undefined && { flexBasis: basis },
        order !== undefined && { order: order },
        grow !== undefined && { flexGrow: grow },
        flex !== undefined && { flex },
        justify && { justifyContent: justify },
        rowwrap && styles.rowwrap,
        align && { alignItems: align },
        row && styles.row,
        bg && { backgroundColor: theme.colors[bg] },
        spacing(props),
        safe && isOldIOS && styles.safe,
        style
      ]}
      {...other}
    >
      {children}
    </RNView>
  );
};

View.propTypes = {
  justify: PropTypes.oneOf([
    'space-between',
    'space-around',
    'space-evenly',
    'flex-start',
    'flex-end',
    'center'
  ]),
  children: PropTypes.node,
  opacity: PropTypes.number,
  rowwrap: PropTypes.bool,
  shrink: PropTypes.number,
  basis: PropTypes.number,
  order: PropTypes.number,
  align: PropTypes.oneOf(['center', 'flex-start', 'flex-end', 'baseline']),
  style: PropTypes.any,
  grow: PropTypes.number,
  flex: PropTypes.number,
  safe: PropTypes.bool,
  bg: PropTypes.oneOf(Object.keys(theme.colors)),
  ...spacing.propTypes
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  rowwrap: {
    flexWrap: 'wrap'
  },
  safe: {
    paddingTop: 20
  }
});

export default View;
