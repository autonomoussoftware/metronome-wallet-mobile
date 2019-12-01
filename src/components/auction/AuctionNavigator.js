import { wrapConnectedComponent } from '../../utils'
import createCustomNavigator from '../common/createCustomNavigator'
import ConfirmPurchase from './ConfirmPurchase'
import BuyDrawer from './BuyMETForm'
import Auction from './Auction'

const AuctionNavigator = createCustomNavigator(
  {
    ConfirmPurchase,
    BuyDrawer: wrapConnectedComponent(BuyDrawer),
    Auction
  },
  {
    initialRouteName: 'Auction'
  }
)

export default AuctionNavigator
