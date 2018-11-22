import createCustomNavigator from '../common/createCustomNavigator'
import ConfirmRecover from './ConfirmRecover'
import ConfirmRescan from './ConfirmRescan'
import Tools from './Tools'

const ToolsNavigator = createCustomNavigator(
  {
    ConfirmRecover,
    ConfirmRescan,
    Tools
  },
  {
    initialRouteName: 'Tools'
  }
)

export default ToolsNavigator
