import { withClient } from './clientContext'
import * as selectors from '../selectors'
import { connect } from 'react-redux'

const mapStateToProps = (state, { client }) => ({
  mtnBalanceWei: selectors.getMtnBalanceWei(state),
  mtnBalanceUSD: selectors.getMtnBalanceUSD(state),
  ethBalanceWei: selectors.getEthBalanceWei(state),
  ethBalanceUSD: selectors.getEthBalanceUSD(state, client)
})

export default Component => withClient(connect(mapStateToProps)(Component))
