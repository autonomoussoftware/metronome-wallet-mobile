import createCustomNavigator from '../common/createCustomNavigator'
import ConfirmSendETH from './ConfirmSendETH'
import ConfirmSendMET from './ConfirmSendMET'
import ReceiveDrawer from './ReceiveDrawer'
import ReceiptDrawer from './ReceiptDrawer'
import SendDrawer from './SendDrawer'
import Dashboard from './Dashboard'

const DashboardNavigator = createCustomNavigator(
  {
    ConfirmSendETH,
    ConfirmSendMET,
    ReceiveDrawer,
    ReceiptDrawer,
    SendDrawer,
    Dashboard
  },
  {
    initialRouteName: 'Dashboard'
  }
)

export default DashboardNavigator
