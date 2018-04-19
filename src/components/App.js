import { Provider as ClientProvider } from '../shared/hocs/clientContext'
import getInitialState from '../getInitialState'
import { Provider } from 'react-redux'
import createStore from '../shared/createStore'
import * as client from '../client'
import Onboarding from './Onboarding'
import Loading from './Loading'
import config from '../config'
import Router from './Router'
import Login from './Login'
import React from 'react'
import Root from '../shared/Root'

const reduxDevtoolsOptions = {
  actionsBlacklist: ['price-updated$'],
  features: { dispatch: true },
  maxAge: 100 // default: 50
}

// We could pass some initial state to createStore()
const store = createStore(reduxDevtoolsOptions, getInitialState(config))

const App = () => (
  <ClientProvider value={client}>
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

export default App
