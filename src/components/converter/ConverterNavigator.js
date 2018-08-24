import { createStackNavigator } from 'react-navigation'
import commonStackStyles from '../commonStackStyles'
import ConfirmETHtoMET from './ConfirmETHtoMET'
import ConfirmMETtoETH from './ConfirmMETtoETH'
import ConvertDrawer from './ConvertDrawer'
import Converter from './Converter'

const ConverterNavigator = createStackNavigator(
  {
    ConfirmETHtoMET,
    ConfirmMETtoETH,
    ConvertDrawer,
    Converter
  },
  {
    navigationOptions: commonStackStyles,
    initialRouteName: 'Converter'
  }
)

ConverterNavigator.navigationOptions = ({ navigation }) => ({
  drawerLockMode: navigation.state.index > 0 ? 'locked-closed' : 'unlocked'
})

export default ConverterNavigator


