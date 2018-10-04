import { Alert, AsyncStorage, TouchableOpacity, SafeAreaView, StyleSheet, View as RNView } from 'react-native'
import withBlockchainState from '../shared/hocs/withBlockchainState'
import { withClient } from '../shared/hocs/clientContext'
import VersionNumber from 'react-native-version-number'
import * as Keychain from 'react-native-keychain'
import RNRestart from 'react-native-restart'
import { StackActions } from 'react-navigation'

import ConverterIcon from './icons/ConverterIcon'
import AuctionIcon from './icons/AuctionIcon'
import WalletIcon from './icons/WalletIcon'
import LogoIcon from './icons/LogoIcon'
import DotIcon from './icons/DotIcon'
import PropTypes from 'prop-types'
import config from '../config'
import Text from './common/Text'
import Logo from './icons/Logo'
import theme from '../theme'
import React from 'react'
import { View } from './common'

class NavigationDrawer extends React.Component {
  static propTypes = {
    blockchainHeight: PropTypes.number.isRequired,
    client: PropTypes.shape({
      onHelpLinkClick: PropTypes.func.isRequired
    }).isRequired,
    navigation: PropTypes.shape({
      isFocused: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired
    }).isRequired
  }

  // TODO: Remove this before final release
  resetStorage = () => {
    Alert.alert(
      'WARNING',
      'This will remove all data. Do you want to continue?',
      [
        { text: 'NO', onPress: () => { }, style: 'cancel' },
        {
          text: 'YES', onPress: () =>
            Promise.all([AsyncStorage.clear(), Keychain.resetGenericPassword()])
              .then(RNRestart.Restart())
        },
      ]
    )
  }

  render() {
    const { isFocused, navigate } = this.props.navigation

    return (
      <RNView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Logo style={styles.logo} />
          <RNView style={styles.primaryNav}>
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
          </RNView>
          <RNView style={styles.secondaryNav}>
            <SecondaryNavBtn
              isActive={isFocused('Tools')}
              onPress={() => navigate('Tools', {}, StackActions.popToTop())}
              label="Tools"
            />
            <SecondaryNavBtn
              isActive={isFocused('Help')}
              onPress={this.props.client.onHelpLinkClick}
              label="Help"
            />
          </RNView>
          {/* TODO: Remove this TouchableOpacity before final release */}
          <View row align="center" justify="space-between" mr={2}>
            <TouchableOpacity onPress={this.resetStorage}>
              <LogoIcon negative style={styles.footerLogo} />
            </TouchableOpacity>
            <View align="flex-end">
              <Text
                size="small"
                weight="semibold"
                style={styles.secondaryBtnLabel}
              >
                {config.eth.chain.charAt(0).toUpperCase() + config.eth.chain.slice(1)}
              </Text>
              <Text
                size="small"
                weight="semibold"
                style={styles.secondaryBtnLabel}
              >
                {this.props.blockchainHeight}
              </Text>
              <Text
                size="small"
                weight="semibold"
                style={styles.secondaryBtnLabel}
              >
                {`${VersionNumber.appVersion}(${VersionNumber.buildVersion})`}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </RNView>
    )
  }
}

const NavBtn = ({ label, isFirst, IconComponent, isActive, ...other }) => (
  <TouchableOpacity activeOpacity={0.5} {...other}>
    <RNView
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
    </RNView>
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
    <RNView style={[styles.secondaryBtn, isActive && styles.secondaryBtnActive]}>
      {isActive && <DotIcon />}
      <Text
        weight="semibold"
        size="medium"
        style={[styles.secondaryBtnLabel, isActive && styles.labelActive]}
      >
        {label}
      </Text>
    </RNView>
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

export default withBlockchainState(withClient(NavigationDrawer))
