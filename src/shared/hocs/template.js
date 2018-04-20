import React from 'react'

const withSomeState = WrappedComponent =>
  class Container extends React.Component {
    static displayName = `withSomeState(${WrappedComponent.displayName ||
      WrappedComponent.name}`

    state = {}

    render() {
      return <WrappedComponent {...this.state} {...this.props} />
    }
  }

export default withSomeState
