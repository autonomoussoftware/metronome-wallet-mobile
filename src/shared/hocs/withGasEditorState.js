import { withClient } from './clientContext';
import PropTypes from 'prop-types';
import React from 'react';

export const getInitialState = (currency, client) => ({
  useCustomGas: false,
  gasPrice: client.fromWei(client.config.DEFAULT_GAS_PRICE, 'gwei'),
  gasLimit: client.config[`${currency}_DEFAULT_GAS_LIMIT`]
});

const withGasEditorState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      onInputChange: PropTypes.func.isRequired,
      useCustomGas: PropTypes.bool.isRequired,
      gasPrice: PropTypes.string.isRequired,
      gasLimit: PropTypes.string.isRequired,
      errors: PropTypes.shape({
        gasPrice: PropTypes.string,
        gasLimit: PropTypes.string
      }).isRequired,
      client: PropTypes.shape({
        getGasPrice: PropTypes.func.isRequired,
        fromWei: PropTypes.func.isRequired
      }).isRequired
    };

    static displayName = `withGasEditorState(${WrappedComponent.displayName ||
      WrappedComponent.name}`;

    componentDidMount() {
      // Avoid getting current price if using custom price
      if (this.props.useCustomGas) return;

      this.props.client
        .getGasPrice()
        .then(({ gasPrice }) => {
          this.props.onInputChange({
            id: 'gasPrice',
            // value: weiToGwei(gasPrice)
            value: this.props.client.fromWei(gasPrice, 'gwei')
          });
        })
        .catch(err => console.warn('Gas price request failed', err));
    }

    onGasToggle = () => {
      const { useCustomGas, onInputChange } = this.props;
      onInputChange({ id: 'useCustomGas', value: !useCustomGas });
    };

    render() {
      return (
        <WrappedComponent onGasToggle={this.onGasToggle} {...this.props} />
      );
    }
  }

  return withClient(Container);
};

export default withGasEditorState;
