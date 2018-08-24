import { createStackNavigator } from 'react-navigation'
import commonStackStyles from '../commonStackStyles'
import ConfirmPurchase from './ConfirmPurchase'
import BuyDrawer from './BuyMETForm'
import Auction from './Auction'

const AuctionNavigator = createStackNavigator(
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

AuctionNavigator.navigationOptions = ({ navigation }) => ({
  drawerLockMode: navigation.state.index > 0 ? 'locked-closed' : 'unlocked'
})

export default AuctionNavigator

