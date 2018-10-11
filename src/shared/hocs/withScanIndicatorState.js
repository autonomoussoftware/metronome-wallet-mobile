import * as selectors from '../selectors'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  isOnline: selectors.getIsOnline(state)
})

export default connect(mapStateToProps)
