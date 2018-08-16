import { createStackNavigator } from 'react-navigation'
import commonStackStyles from '../commonStackStyles'
import ConfirmPurchase from './ConfirmPurchase'
import BuyDrawer from './BuyMETForm'
import Auction from './Auction'

export default createStackNavigator(
  {
    ConfirmPurchase,
    BuyDrawer,
    Auction
  },
  {
    navigationOptions: commonStackStyles,
    initialRouteName: 'Auction'
  }
)
