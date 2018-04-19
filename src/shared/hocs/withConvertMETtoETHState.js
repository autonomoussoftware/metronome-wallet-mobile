import { getInitialState } from './withGasEditorState';
import * as validators from '../validators';
import * as selectors from '../selectors';
import { withClient } from './clientContext';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import * as utils from '../utils';
import PropTypes from 'prop-types';
import React from 'react';

const withConvertMETtoETHState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      availableMET: PropTypes.string.isRequired,
      client: PropTypes.shape({
        getConvertMetGasLimit: PropTypes.func.isRequired,
        convertMet: PropTypes.func.isRequired,
        fromWei: PropTypes.func.isRequired,
        toWei: PropTypes.func.isRequired,
        config: PropTypes.shape({
          MET_DEFAULT_GAS_LIMIT: PropTypes.string.isRequired,
          DEFAULT_GAS_PRICE: PropTypes.string.isRequired
        }).isRequired
      }).isRequired,
      from: PropTypes.string.isRequired
    };

    static displayName = `withConvertMETtoETHState(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    initialState = {
      metAmount: null,
      ...getInitialState('MET', this.props.client),
      estimate: null,
      errors: {}
    };

    state = this.initialState;

    resetForm = () => this.setState(this.initialState);

    onInputChange = ({ id, value }) => {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [id]: null },
        [id]: value
      }));

      // Estimate gas limit again if parameters changed
      if (['metAmount'].includes(id)) this.getGasEstimate();
    };

    getGasEstimate = debounce(() => {
      const { metAmount } = this.state;

      if (!utils.isWeiable(metAmount)) return;

      this.props.client
        .getConvertMetGasLimit({
          value: this.props.client.toWei(utils.sanitize(metAmount)),
          from: this.props.from
        })
        .then(({ gasLimit }) =>
          this.setState({ gasLimit: gasLimit.toString() })
        )
        .catch(err => console.warn('Gas estimation failed', err));
    }, 500);

    onWizardSubmit = password => {
      return this.props.client.convertMet({
        gasPrice: this.props.client.toWei(this.state.gasPrice, 'gwei'),
        gasLimit: this.state.gasLimit,
        password,
        value: this.props.client.toWei(utils.sanitize(this.state.metAmount)),
        from: this.props.from
      });
    };

    validate = () => {
      const { metAmount, gasPrice, gasLimit, client } = this.state;
      const max = client.fromWei(this.props.availableMET);
      const errors = {
        ...validators.validateMetAmount(metAmount, max),
        ...validators.validateGasPrice(gasPrice),
        ...validators.validateGasLimit(gasLimit)
      };
      const hasErrors = Object.keys(errors).length > 0;
      if (hasErrors) this.setState({ errors });
      return !hasErrors;
    };

    onMaxClick = () => {
      const metAmount = this.props.client.fromWei(this.props.availableMET);
      this.onInputChange({ id: 'metAmount', value: metAmount });
    };

    render() {
      const { metAmount } = this.state;

      return (
        <WrappedComponent
          onInputChange={this.onInputChange}
          onMaxClick={this.onMaxClick}
          resetForm={this.resetForm}
          {...this.props}
          {...this.state}
          metPlaceholder={
            metAmount === 'Invalid amount' ? 'Invalid amount' : '0.00'
          }
          metAmount={metAmount === 'Invalid amount' ? '' : metAmount}
        />
      );
    }
  }

  const mapStateToProps = state => ({
    availableMET: selectors.getMtnBalanceWei(state),
    from: selectors.getActiveWalletAddresses(state)[0]
  });

  return connect(mapStateToProps)(withClient(Container));
};

export default withConvertMETtoETHState;
