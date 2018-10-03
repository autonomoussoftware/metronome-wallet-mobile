import { SafeAreaView, StyleSheet } from 'react-native'
import { StackActions } from 'react-navigation'
import SecondaryNavBtn from './SecondaryNavBtn'
import { withClient } from '../../shared/hocs/clientContext'
import ConverterIcon from '../icons/ConverterIcon'
import AuctionIcon from '../icons/AuctionIcon'
import WipeStorage from './WipeStorage'
import WalletIcon from '../icons/WalletIcon'
import PropTypes from 'prop-types'
import LogoIcon from '../icons/LogoIcon'
import { View } from '../common'
import AppMeta from './AppMeta'
import NavBtn from './NavBtn'
import React from 'react'
import Logo from '../icons/Logo'

class Drawer extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      closeDrawer: PropTypes.func.isRequired,
      isFocused: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired
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
    const { isFocused } = this.props.navigation

    return (
      <View bg="dark" flex={1}>
        <SafeAreaView style={styles.safeArea}>
          <View mb={5} ml={3} mt={5}>
            <Logo />
          </View>
          <View grow={1}>
            <NavBtn
              IconComponent={WalletIcon}
              isActive={isFocused('Dashboard')}
              onPress={() => this.navigateTo('Dashboard')}
              isFirst
              label="WALLETS"
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
