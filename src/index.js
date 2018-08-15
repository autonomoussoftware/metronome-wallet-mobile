import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import React from 'react'
import { Provider as ClientProvider } from './shared/hocs/clientContext'
import config from './config'
import createClient from './client'
import createStore from './shared/createStore'
import getInitialState from './getInitialState'
import Loading from './components/Loading'
import Login from './components/Login'
import Onboarding from './components/onboarding/Onboarding'
import Root from './shared/Root'
import Router from './components/Router'
import RN from 'react-native'

const reduxDevtoolsOptions = {
  actionsBlacklist: ['price-updated$'],
  features: { dispatch: true },
  maxAge: 100 // default: 50
}

const store = createStore(reduxDevtoolsOptions, getInitialState(config))

const App = () => (
  <ClientProvider value={createClient(store)}>
    <RN.StatusBar barStyle="light-content" />
    <Provider store={store}>
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
