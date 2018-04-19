import PropTypes from 'prop-types';
import { View } from '../common';
import LeftBtn from './LeftBtn';
import Title from './Title';
import React from 'react';
import RN from 'react-native';

export default class Header extends React.Component {
  static propTypes = {
    openDrawer: PropTypes.func.isRequired
  };

  render() {
    const { openDrawer } = this.props;

    return (
      <View bg="primary" safe>
        <RN.StatusBar barStyle="light-content" />
        <RN.SafeAreaView>
          <View row align="center" px={1} py={2}>
            <LeftBtn openDrawer={openDrawer} />
            <Title />
          </View>
        </RN.SafeAreaView>
      </View>
    );
  }
}
