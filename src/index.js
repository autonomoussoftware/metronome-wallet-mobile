import { Provider as ClientProvider } from 'metronome-wallet-ui-logic/src/hocs/clientContext'
import { Provider, createStore } from 'metronome-wallet-ui-logic/src/store'
import SplashScreen from 'react-native-splash-screen'
import React from 'react'
import Root from 'metronome-wallet-ui-logic/src/components/Root'
import RN from 'react-native'

import createClient from './client'
import Onboarding from './components/onboarding/Onboarding'
import Loading from './components/Loading'
import Router from './components/Router'
import config from './config'
import Login from './components/Login'

// Disable socket-io warnings
// @see https://github.com/socketio/socket.io-client/issues/1290
RN.YellowBox.ignoreWarnings([
  'Setting a timer',
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
])

// Enable LayoutAnimation on Android
// @see https://facebook.github.io/react-native/docs/animations
RN.NativeModules.UIManager.setLayoutAnimationEnabledExperimental &&
  RN.NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true)

const client = createClient(config, createStore)

class App extends React.Component {
  componentDidMount() {
    SplashScreen.hide()
  }

  render() {
    return (
      <ClientProvider value={client}>
        <RN.StatusBar barStyle="light-content" />
        <Provider store={client.store}>
          <Root
            OnboardingComponent={Onboarding}
            LoadingComponent={Loading}
            RouterComponent={Router}
            LoginComponent={Login}
          />
        </Provider>
      </ClientProvider>
    )
  }
}

RN.AppRegistry.registerComponent('MetronomeWallet', () => App)
