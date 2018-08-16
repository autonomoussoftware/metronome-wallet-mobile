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
    fontWeight: theme.weights.bold,
    fontFamily: 'Muli',
    fontSize: theme.sizes.large,
    color: theme.colors.light
  }
}
