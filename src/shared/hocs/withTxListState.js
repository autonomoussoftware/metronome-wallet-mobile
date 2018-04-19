import { withClient } from './clientContext'
import * as selectors from '../selectors'
import { connect } from 'react-redux'

const mapStateToProps = (state, { client }) => ({
  items: selectors.getActiveWalletTransactions(state, client)
})

export default Component => withClient(connect(mapStateToProps)(Component))
