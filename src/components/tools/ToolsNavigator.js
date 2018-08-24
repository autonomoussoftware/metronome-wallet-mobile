import { createStackNavigator } from 'react-navigation'
import commonStackStyles from '../commonStackStyles'
import ConfirmRecover from './ConfirmRecover'
import ConfirmRescan from './ConfirmRescan'
import Tools from './Tools'

const ToolsNavigator = createStackNavigator(
  {
    ConfirmRecover,
    ConfirmRescan,
    Tools
  },
  {
    initialRouteName: 'Tools',
    navigationOptions: commonStackStyles
  }
)

ToolsNavigator.navigationOptions = ({ navigation }) => ({
  drawerLockMode: navigation.state.index > 0 ? 'locked-closed' : 'unlocked'
})

export default ToolsNavigator
