import { wrapConnectedComponent } from '../../utils'
import createCustomNavigator from '../common/createCustomNavigator'
import ConfirmSendCoin from './ConfirmSendCoin'
import ConfirmSendMET from './ConfirmSendMET'
import ReceiveDrawer from './ReceiveDrawer'
import ReceiptDrawer from './ReceiptDrawer'
import SendDrawer from './SendDrawer'
import Dashboard from './Dashboard'

const DashboardNavigator = createCustomNavigator(
  {
    ConfirmSendCoin,
    ConfirmSendMET,
    ReceiveDrawer: wrapConnectedComponent(ReceiveDrawer),
    ReceiptDrawer: wrapConnectedComponent(ReceiptDrawer),
    SendDrawer: wrapConnectedComponent(SendDrawer),
    Dashboard
  },
  {
    initialRouteName: 'Dashboard'
  }
)

export default DashboardNavigator
