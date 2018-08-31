import React from 'react'
import RN, { AppRegistry,  YellowBox } from 'react-native'

import SplashScreen from 'react-native-splash-screen'
import { Provider } from 'react-redux'

import { Provider as ClientProvider } from './shared/hocs/clientContext'
import config from './config'
import createClient from './client'
import createStore from './shared/createStore'
import Loading from './components/Loading'
import Login from './components/Login'
import Onboarding from './components/onboarding/Onboarding'
import Root from './shared/Root'
import Router from './components/Router'

YellowBox.ignoreWarnings(['Setting a timer'])

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
            LoginComponent={Login} />
        </Provider>
      </ClientProvider>
    )
  }
}

AppRegistry.registerComponent('MetronomeWallet', () => App)
