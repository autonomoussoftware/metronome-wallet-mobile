import { Provider } from 'react-redux'
import React from 'react'
import RN, { AppRegistry } from 'react-native'

import { Provider as ClientProvider } from './shared/hocs/clientContext'
import config from './config'
import createClient from './client'
import createStore from './shared/createStore'
import Loading from './components/Loading'
import Login from './components/Login'
import Onboarding from './components/onboarding/Onboarding'
import Root from './shared/Root'
import Router from './components/Router'

const client = createClient(config, createStore)

const App = () => (
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

AppRegistry.registerComponent('MetronomeWallet', () => App)
