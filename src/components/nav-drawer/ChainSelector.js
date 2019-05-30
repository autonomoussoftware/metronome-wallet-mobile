import { StyleSheet, TouchableOpacity } from 'react-native'
import withChainSelectorState from 'metronome-wallet-ui-logic/src/hocs/withChainSelectorState'
import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'

import { DisplayValue, View, Text } from '../common'
import CoinIcon from '../icons/CoinIcon'
import Caret from '../icons/CaretIcon'

const BORDER_RADIUS = 12
const ITEM_HEIGHT = 60

const Item = props => (
  <TouchableOpacity activeOpacity={0.75} onPress={props.onPress}>
    <View
      style={[
        styles.btn,
        props.isFirst && styles.btnFirst,
        props.isLast && styles.btnLast
      ]}
      align="center"
      row
      bg={props.isActive ? 'translucentPrimary' : 'darkShade'}
      py={1.5}
      px={2}
    >
      <CoinIcon coin={props.id} />
      <View grow={1} shrink={1} ml={1}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          weight="semibold"
          size="xSmall"
          ls={1.6}
        >
          {(props.displayName || '').toUpperCase()}
        </Text>
        <DisplayValue
          weight="semibold"
          value={props.balance}
          color="primary"
          post=" MET"
          size="small"
          ls={0.5}
        />
      </View>
      {props.isFirst && (
        <View shrink={0}>
          <Caret up={props.isActive} />
        </View>
      )}
    </View>
  </TouchableOpacity>
)

Item.propTypes = {
  displayName: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  balance: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  id: PropTypes.string.isRequired
}

class ChainSelector extends React.Component {
  static propTypes = {
    onChainChange: PropTypes.func.isRequired,
    isDrawerOpen: PropTypes.bool.isRequired,
    activeChain: PropTypes.string.isRequired,
    chains: PropTypes.arrayOf(
      PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
      })
    ).isRequired
  }

  state = { isOpen: false }

  handleToggle = () => this.setState(state => ({ isOpen: !state.isOpen }))

  handleChainSelect = chainName => {
    this.setState({ isOpen: false }, () => this.props.onChainChange(chainName))
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.isOpen &&
      !this.props.isDrawerOpen &&
      prevProps.isDrawerOpen
    ) {
      this.setState({ isOpen: false })
    }
  }

  render() {
    const activeItem = this.props.chains.find(
      ({ id }) => id === this.props.activeChain
    )

    if ((this.props.chains || []).length < 2) return null

    return (
      <View
        style={[
          styles.container,
          {
            marginBottom: this.state.isOpen
              ? ((this.props.chains || []).length - 1) * ITEM_HEIGHT * -1 +
                theme.spacing(2)
              : theme.spacing(2)
          }
        ]}
        mt={-3.5}
        ml={2}
        mr={2}
      >
        <Text ml={1} mb={1} size="xSmall" ls={1} opacity={0.8}>
          CHAIN
        </Text>
        <Item onPress={this.handleToggle} isFirst isLast {...activeItem} />
        {this.state.isOpen && (
          <View
            shadowOpacity={0.5}
            shadowOffset={{ height: 10 }}
            shadowRadius={24}
            shadowColor="#000"
            style={styles.dropdownContainer}
            bg="dark"
          >
            {[
              <Item
                isActive
                onPress={this.handleToggle}
                isFirst
                key={activeItem.id}
                {...activeItem}
              />,
              this.props.chains
                .filter(({ id }) => id !== this.props.activeChain)
                .map((chain, i) => (
                  <Item
                    onPress={() => this.handleChainSelect(chain.id)}
                    isLast={i === this.props.chains.length - 2}
                    key={chain.id}
                    {...chain}
                  />
                ))
            ]}
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1
  },
  btn: {
    height: ITEM_HEIGHT
  },
  btnFirst: {
    borderTopRightRadius: BORDER_RADIUS,
    borderTopLeftRadius: BORDER_RADIUS
  },
  btnLast: {
    borderBottomRightRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS
  },
  dropdownContainer: {
    borderRadius: BORDER_RADIUS,
    marginTop: ITEM_HEIGHT * -1,
    elevation: 16,
    width: '100%'
  }
})

export default withChainSelectorState(ChainSelector)
