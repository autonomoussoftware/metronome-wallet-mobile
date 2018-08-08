import { TouchableOpacity, SafeAreaView, StyleSheet, View } from 'react-native'
import ConverterIcon from './icons/ConverterIcon'
import AuctionIcon from './icons/AuctionIcon'
import WalletIcon from './icons/WalletIcon'
import { Route } from 'react-router'
import PropTypes from 'prop-types'
import { Link } from 'react-router-native'
import LogoIcon from './icons/LogoIcon'
import DotIcon from './icons/DotIcon'
import theme from '../theme'
import React from 'react'
import Text from './common/Text'
import Logo from './icons/Logo'

export default class Sidebar extends React.Component {
  static propTypes = {
    onLinkPress: PropTypes.func.isRequired
  }

  render() {
    const { onLinkPress } = this.props

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Logo style={styles.logo} />
          <View style={styles.primaryNav}>
            <NavBtn
              IconComponent={WalletIcon}
              onPress={onLinkPress}
              isFirst
              label="WALLETS"
              to="/wallets"
            />
            <NavBtn
              IconComponent={AuctionIcon}
              onPress={onLinkPress}
              label="AUCTION"
              to="/auction"
            />
            <NavBtn
              IconComponent={ConverterIcon}
              onPress={onLinkPress}
              label="CONVERTER"
              to="/converter"
            />
          </View>
          <View style={styles.secondaryNav}>
            <SecondaryNavBtn
              onPress={onLinkPress}
              label="Settings"
              to="/settings"
            />
            <SecondaryNavBtn onPress={onLinkPress} label="Tools" to="/tools" />
            <SecondaryNavBtn onPress={onLinkPress} label="Help" to="/help" />
          </View>
          <LogoIcon style={styles.footerLogo} />
        </SafeAreaView>
      </View>
    )
  }
}

const NavBtn = ({ label, isFirst, IconComponent, to, ...other }) => (
  <Link component={TouchableOpacity} activeOpacity={0.5} to={to} {...other}>
    <Route path={to}>
      {({ match: isActive }) => (
        <View
          style={[
            styles.btn,
            isFirst && styles.btnFirst,
            isActive && styles.btnActive
          ]}
        >
          <IconComponent isActive={!!isActive} />
          <Text
            weight="semibold"
            style={[styles.btnLabel, isActive && styles.labelActive]}
          >
            {label}
          </Text>
        </View>
      )}
    </Route>
  </Link>
)

NavBtn.propTypes = {
  IconComponent: PropTypes.func.isRequired,
  isFirst: PropTypes.bool,
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
}

const SecondaryNavBtn = ({ label, to, ...other }) => (
  <Link component={TouchableOpacity} activeOpacity={0.5} to={to} {...other}>
    <Route path={to} exact>
      {({ match: isActive }) => (
        <View
          style={[styles.secondaryBtn, isActive && styles.secondaryBtnActive]}
        >
          {isActive && <DotIcon />}
          <Text
            weight="semibold"
            style={[styles.secondaryBtnLabel, isActive && styles.labelActive]}
          >
            {label}
          </Text>
        </View>
      )}
    </Route>
  </Link>
)

SecondaryNavBtn.propTypes = {
  isFirst: PropTypes.bool,
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.dark,
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  logo: {
    marginTop: theme.spacing(5),
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(5)
  },
  btn: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.darkShade,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(3)
  },
  primaryNav: {
    flexGrow: 1
  },
  secondaryNav: {},
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1.5)
  },
  btnActive: {
    backgroundColor: theme.colors.translucentPrimary,
    borderBottomColor: theme.colors.primary
  },
  btnFirst: {
    borderTopWidth: 2,
    borderTopColor: theme.colors.darkShade
  },
  btnLabel: {
    letterSpacing: 1.6,
    marginLeft: theme.spacing(2),
    color: theme.colors.light,
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.65
  },
  secondaryBtnLabel: {
    color: theme.colors.light,
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.65
  },
  labelActive: {
    opacity: 1
  },
  footerLogo: {
    margin: theme.spacing(2)
  }
})
