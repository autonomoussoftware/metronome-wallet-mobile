import createCustomNavigator from '../common/createCustomNavigator'
import ConfirmETHtoMET from './ConfirmETHtoMET'
import ConfirmMETtoETH from './ConfirmMETtoETH'
import ConvertDrawer from './ConvertDrawer'
import Converter from './Converter'

const ConverterNavigator = createCustomNavigator(
  {
    ConfirmETHtoMET,
    ConfirmMETtoETH,
    ConvertDrawer,
    Converter
  },
  {
    initialRouteName: 'Converter'
  }
)

export default ConverterNavigator


