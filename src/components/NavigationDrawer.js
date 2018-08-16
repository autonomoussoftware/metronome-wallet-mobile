import { TouchableOpacity, SafeAreaView, StyleSheet, View } from 'react-native'
import { StackActions } from 'react-navigation'
import ConverterIcon from './icons/ConverterIcon'
import AuctionIcon from './icons/AuctionIcon'
import WalletIcon from './icons/WalletIcon'
import PropTypes from 'prop-types'
import LogoIcon from './icons/LogoIcon'
import DotIcon from './icons/DotIcon'
import theme from '../theme'
import React from 'react'
import Text from './common/Text'
import Logo from './icons/Logo'

export default class NavigationDrawer extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      isFocused: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const { isFocused, navigate } = this.props.navigation

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Logo style={styles.logo} />
          <View style={styles.primaryNav}>
            <NavBtn
              IconComponent={WalletIcon}
              isActive={isFocused('Dashboard')}
              onPress={() => navigate('Dashboard', {}, StackActions.popToTop())}
              isFirst
              label="WALLETS"
            />
            <NavBtn
              IconComponent={AuctionIcon}
              isActive={isFocused('Auction')}
              onPress={() => navigate('Auction', {}, StackActions.popToTop())}
              label="AUCTION"
            />
            <NavBtn
              IconComponent={ConverterIcon}
              isActive={isFocused('Converter')}
              onPress={() => navigate('Converter', {}, StackActions.popToTop())}
              label="CONVERTER"
            />
          </View>
          <View style={styles.secondaryNav}>
            <SecondaryNavBtn
              isActive={isFocused('Settings')}
              onPress={() => navigate('Settings', {}, StackActions.popToTop())}
              label="Settings"
            />
            <SecondaryNavBtn
              isActive={isFocused('Tools')}
              onPress={() => navigate('Tools', {}, StackActions.popToTop())}
              label="Tools"
            />
            <SecondaryNavBtn
              isActive={isFocused('Help')}
              onPress={() => navigate('Help')}
              label="Help"
            />
          </View>
          <LogoIcon style={styles.footerLogo} />
        </SafeAreaView>
      </View>
    )
  }
}

const NavBtn = ({ label, isFirst, IconComponent, isActive, ...other }) => (
  <TouchableOpacity activeOpacity={0.5} {...other}>
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
  </TouchableOpacity>
)

NavBtn.propTypes = {
  IconComponent: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  isFirst: PropTypes.bool,
  label: PropTypes.string.isRequired
}

const SecondaryNavBtn = ({ label, isActive, ...other }) => (
  <TouchableOpacity activeOpacity={0.5} {...other}>
    <View style={[styles.secondaryBtn, isActive && styles.secondaryBtnActive]}>
      {isActive && <DotIcon />}
      <Text
        weight="semibold"
        style={[styles.secondaryBtnLabel, isActive && styles.labelActive]}
      >
        {label}
      </Text>
    </View>
  </TouchableOpacity>
)

SecondaryNavBtn.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isFirst: PropTypes.bool,
  label: PropTypes.string.isRequired
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
