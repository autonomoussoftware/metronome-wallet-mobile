import { Switch, Route, Redirect } from 'react-router'
import { NativeRouter } from 'react-router-native'
import DrawerLayout from 'react-native-drawer-layout-polyfill'
import Converter from './converter/Converter'
import Dashboard from './dashboard/Dashboard'
import Settings from './Settings'
import { View } from './common'
import Auction from './auction/Auction'
import Sidebar from './Sidebar'
import Header from './Header'
import Tools from './Tools'
import React from 'react'

export default class Router extends React.Component {
  getDrawerRef = element => {
    this.drawer = element
  }

  openDrawer = () => this.drawer.openDrawer()

  closeDrawer = () => this.drawer.closeDrawer()

  renderNavigationView = () => <Sidebar onLinkPress={this.closeDrawer} />

  homeRoute = () => <Redirect to="/dashboard" />

  shouldComponentUpdate() {
    return false
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
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/converter" component={Converter} />
              <Route path="/settings" component={Settings} />
              <Route path="/auction" component={Auction} />
              <Route path="/tools" component={Tools} />
            </Switch>
          </View>
        </DrawerLayout>
      </NativeRouter>
    )
  }
}
