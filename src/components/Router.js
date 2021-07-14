import {createAppContainer} from 'react-navigation'
import {createDrawerNavigator} from 'react-navigation-drawer'

import DashboardNavigator from './dashboard/DashboardNavigator'
import ConverterNavigator from './converter/ConverterNavigator'
import AuctionNavigator from './auction/AuctionNavigator'
import NavigationDrawer from './nav-drawer/Drawer'
import ToolsNavigator from './tools/ToolsNavigator'
import PortNavigator from './port/PortNavigator'

export default createAppContainer(
  createDrawerNavigator(
    {
      Dashboard: DashboardNavigator,
      Converter: ConverterNavigator,
      Auction: AuctionNavigator,
      Tools: ToolsNavigator,
      Port: PortNavigator,
    },
    {
      useNativeAnimations: true,
      initialRouteName: 'Dashboard',
      contentComponent: NavigationDrawer,
      drawerWidth: 260,
    },
  ),
)
