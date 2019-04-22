import { SafeAreaView, StyleSheet } from 'react-native'
import { StackActions } from 'react-navigation'
import { withClient } from 'metronome-wallet-ui-logic/src/hocs/clientContext'
import PropTypes from 'prop-types'
import React from 'react'

import SecondaryNavBtn from './SecondaryNavBtn'
import ConverterIcon from '../icons/ConverterIcon'
import ChainSelector from './ChainSelector'
import AuctionIcon from '../icons/AuctionIcon'
import WipeStorage from './WipeStorage'
import WalletIcon from '../icons/WalletIcon'
import PortIcon from '../icons/PortIcon'
import LogoIcon from '../icons/LogoIcon'
import { View } from '../common'
import AppMeta from './AppMeta'
import NavBtn from './NavBtn'
import Logo from '../icons/Logo'

class Drawer extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      closeDrawer: PropTypes.func.isRequired,
      isFocused: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
      state: PropTypes.shape({
        isDrawerOpen: PropTypes.bool.isRequired
      }).isRequired
    }).isRequired,
    client: PropTypes.shape({
      onHelpLinkClick: PropTypes.func.isRequired
    }).isRequired
  }

  navigateTo = route => {
    const { navigate, closeDrawer } = this.props.navigation
    navigate(route, {}, StackActions.popToTop())
    closeDrawer()
  }

  render() {
    const {
      isFocused,
      state: { isDrawerOpen }
    } = this.props.navigation

    return (
      <View bg="dark" flex={1}>
        <SafeAreaView style={styles.safeArea}>
          <View mb={5} mr={2} mt={4} align="flex-end">
            <Logo />
          </View>
          <View grow={1}>
            <ChainSelector isDrawerOpen={isDrawerOpen} />
            <NavBtn
              IconComponent={WalletIcon}
              isActive={isFocused('Dashboard')}
              onPress={() => this.navigateTo('Dashboard')}
              isFirst
              label="WALLET"
            />
            <NavBtn
              IconComponent={AuctionIcon}
              isActive={isFocused('Auction')}
              onPress={() => this.navigateTo('Auction')}
              label="AUCTION"
            />
            <NavBtn
              IconComponent={ConverterIcon}
              isActive={isFocused('Converter')}
              onPress={() => this.navigateTo('Converter')}
              label="CONVERTER"
            />
            <NavBtn
              IconComponent={PortIcon}
              isActive={isFocused('Port')}
              onPress={() => this.navigateTo('Port')}
              label="PORT"
            />
          </View>
          <View>
            <SecondaryNavBtn
              isActive={isFocused('Tools')}
              onPress={() => this.navigateTo('Tools')}
              label="Tools"
            />
            <SecondaryNavBtn
              isActive={isFocused('Help')}
              onPress={this.props.client.onHelpLinkClick}
              label="Help"
            />
          </View>
          <View row align="flex-end" justify="space-between" m={2}>
            <WipeStorage>
              <LogoIcon negative />
            </WipeStorage>
            <AppMeta />
          </View>
        </SafeAreaView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 }
})

export default withClient(Drawer)
