import * as selectors from '../selectors';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  mtnBalanceWei: selectors.getMtnBalanceWei(state),
  mtnBalanceUSD: selectors.getMtnBalanceUSD(state),
  ethBalanceWei: selectors.getEthBalanceWei(state),
  ethBalanceUSD: selectors.getEthBalanceUSD(state)
});

export default connect(mapStateToProps);
