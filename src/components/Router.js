import { createDrawerNavigator } from 'react-navigation'

import DashboardNavigator from './dashboard/DashboardNavigator'
import ConverterNavigator from './converter/ConverterNavigator'
import AuctionNavigator from './auction/AuctionNavigator'
import NavigationDrawer from './nav-drawer/Drawer'
import ToolsNavigator from './tools/ToolsNavigator'

export default createDrawerNavigator(
  {
    Dashboard: DashboardNavigator,
    Converter: ConverterNavigator,
    Auction: AuctionNavigator,
    Tools: ToolsNavigator
  },
  {
    useNativeAnimations: true,
    initialRouteName: 'Dashboard',
    contentComponent: NavigationDrawer,
    drawerWidth: 260
  }
)
