import { getBlockHeight } from '../selectors'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  blockchainHeight: getBlockHeight(state),
})

export default Component => connect(mapStateToProps)(Component)
