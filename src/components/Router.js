import { createDrawerNavigator } from 'react-navigation'
import DashboardNavigator from './dashboard/DashboardNavigator'
import ConverterNavigator from './converter/ConverterNavigator'
import SettingsNavigator from './settings/SettingsNavigator'
import AuctionNavigator from './auction/AuctionNavigator'
import NavigationDrawer from './NavigationDrawer'
import ToolsNavigator from './tools/ToolsNavigator'

export default createDrawerNavigator(
  {
    Dashboard: DashboardNavigator,
    Converter: ConverterNavigator,
    Settings: SettingsNavigator,
    Auction: AuctionNavigator,
    Tools: ToolsNavigator
  },
  {
    useNativeAnimations: true,
    initialRouteName: 'Dashboard',
    contentComponent: NavigationDrawer,
    drawerWidth: 280
  }
)
