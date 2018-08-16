import { createStackNavigator } from 'react-navigation'
import commonStackStyles from '../commonStackStyles'
import ConfirmSendETH from './ConfirmSendETH'
import ConfirmSendMET from './ConfirmSendMET'
import ReceiveDrawer from './ReceiveDrawer'
import ReceiptDrawer from './ReceiptDrawer'
import SendDrawer from './SendDrawer'
import Dashboard from './Dashboard'

export default createStackNavigator(
  {
    ConfirmSendETH,
    ConfirmSendMET,
    ReceiveDrawer,
    ReceiptDrawer,
    SendDrawer,
    Dashboard
  },
  {
    navigationOptions: commonStackStyles,
    initialRouteName: 'Dashboard'
  }
)
