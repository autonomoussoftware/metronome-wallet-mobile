import { withNavigation } from 'react-navigation'
import withTxRowState from 'metronome-wallet-ui-logic/src/hocs/withTxRowState'
import PropTypes from 'prop-types'
import theme from 'metronome-wallet-ui-logic/src/theme'
import React from 'react'
import RN from 'react-native'

import { View } from '../../common'
import Details from './Details'
import Amount from './Amount'
import Icon from './Icon'

class Row extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired
    }).isRequired,
    isPending: PropTypes.bool.isRequired,
    hash: PropTypes.string.isRequired
  }

  onPress = () => {
    this.props.navigation.navigate('ReceiptDrawer', {
      hash: this.props.hash
    })
  }

  render() {
    return (
      <RN.TouchableOpacity
        activeOpacity={0.95}
        onPress={this.onPress}
        style={styles.touchableContainer}
      >
        <View style={styles.container} pr={2} py={1.5} row>
          <Icon {...this.props} />
          <View grow={1} shrink={1} align="flex-end" ml={1}>
            <View
              opacity={this.props.isPending ? 0.5 : 1}
              align="flex-end"
              row
              mt={0.2}
            >
              <Amount {...this.props} />
            </View>
            <View mt={0.5} opacity={this.props.isPending ? 0.8 : 1}>
              <Details {...this.props} />
            </View>
          </View>
        </View>
      </RN.TouchableOpacity>
    )
  }
}

const styles = RN.StyleSheet.create({
  touchableContainer: {
    backgroundColor: theme.colors.light,
    paddingLeft: theme.spacing(2)
  },
  container: {
    borderBottomWidth: RN.StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.lightShade,
    height: 70
  }
})

export default withTxRowState(withNavigation(Row))
