import React from 'react'

const ClientContext = React.createContext()

export const Provider = ClientContext.Provider

export const withClient = WrappedComponent => {
  class Container extends React.Component {
    static displayName = `withClient(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    injectClient = client => (
      <WrappedComponent {...this.props} client={client} />
    )

    render() {
      return (
        <ClientContext.Consumer>{this.injectClient}</ClientContext.Consumer>
      )
    }
  }

  return Container
}
