import { fontStyles } from '../utils'
import theme from '../theme'

export default {
  headerStyle: {
    borderBottomWidth: 0,
    backgroundColor: theme.colors.primary
  },
  headerTintColor: theme.colors.light,
  headerTitleStyle: {
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    textShadowColor: theme.colors.darkShade,
    fontSize: theme.sizes.large,
    color: theme.colors.light,
    ...fontStyles('bold')
  }
}
