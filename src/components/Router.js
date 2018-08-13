import { createDrawerNavigator } from 'react-navigation'
import DashboardNavigator from './dashboard/DashboardNavigator'
import ConverterNavigator from './converter/ConverterNavigator'
import AuctionNavigator from './auction/AuctionNavigator'
import NavigationDrawer from './NavigationDrawer'
import Settings from './Settings'
import Tools from './Tools'

export default createDrawerNavigator(
  {
    Dashboard: DashboardNavigator,
    Converter: ConverterNavigator,
    Settings,
    Auction: AuctionNavigator,
    Tools
  },
  {
    useNativeAnimations: true,
    initialRouteName: 'Dashboard',
    contentComponent: NavigationDrawer,
    drawerWidth: 280
  }
)
