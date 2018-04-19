import { NativeRouter, Switch, Route, Redirect } from 'react-router-native';
import DrawerLayout from 'react-native-drawer-layout-polyfill';
import Converter from './Converter';
import Settings from './Settings';
import { View } from './common';
import Wallets from './Wallets';
import Sidebar from './Sidebar';
import Auction from './Auction';
import Header from './Header';
import Tools from './Tools';
import React from 'react';

export default class Router extends React.Component {
  getDrawerRef = element => {
    this.drawer = element;
  };

  openDrawer = () => this.drawer.openDrawer();

  closeDrawer = () => this.drawer.closeDrawer();

  renderNavigationView = () => <Sidebar onLinkPress={this.closeDrawer} />;

  homeRoute = () => <Redirect to="/wallets" />;

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <NativeRouter>
        <DrawerLayout
          renderNavigationView={this.renderNavigationView}
          keyboardDismissMode="on-drag"
          useNativeAnimations
          drawerWidth={280}
          ref={this.getDrawerRef}
        >
          <View bg="dark" flex={1}>
            <Header openDrawer={this.openDrawer} />
            <Switch>
              <Route path="/" exact render={this.homeRoute} />
              <Route path="/converter" component={Converter} />
              <Route path="/settings" component={Settings} />
              <Route path="/wallets" component={Wallets} />
              <Route path="/auction" component={Auction} />
              <Route path="/tools" component={Tools} />
            </Switch>
          </View>
        </DrawerLayout>
      </NativeRouter>
    );
  }
}
