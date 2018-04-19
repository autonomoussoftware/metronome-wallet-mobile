import { View, Text, BaseBtn } from '../common';
import Svg, { G, Line } from 'react-native-svg';
import PropTypes from 'prop-types';
import theme from '../../theme';
import React from 'react';
import RN from 'react-native';

class TxListHeader extends React.Component {
  static propTypes = {
    selectFilter: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired
  };

  options = {
    all: 'ALL',
    sent: 'SENT',
    received: 'RECEIVED',
    auction: 'AUCTION',
    converted: 'CONVERTED'
  };

  state = { isOpen: false };

  toggleDropdown = () => {
    this.setState(s => ({ ...s, isOpen: !s.isOpen }));
  };

  onOptionSelect = key => {
    this.setState({ isOpen: false }, () => this.props.selectFilter(key));
  };

  render() {
    return (
      <View justify="space-between" align="center" row bg="primary" py={1}>
        <View>
          <Text size="medium" ml={2} py={1}>
            Transactions
          </Text>
        </View>
        <View px={1}>
          <RN.TouchableOpacity
            activeOpacity={0.9}
            onPress={this.toggleDropdown}
          >
            <View
              style={styles.dropdownBtn}
              align="center"
              row
              bg={this.state.isOpen ? 'dark' : 'transparent'}
              py={1.25}
              px={1}
            >
              <Text size="small" mx={1} opacity={1}>
                {this.options[this.props.filter]}
              </Text>
              <Svg viewBox="0 2 21 20" width="14" height="12">
                <G
                  strokeLinecap="round"
                  strokeWidth="2"
                  fillRule="evenodd"
                  stroke="white"
                  fill="none"
                >
                  <G
                    rotation={this.state.isOpen ? '90' : '-90'}
                    origin="10, 13"
                  >
                    <Line x1="7" y1="13" x2="15" y2="5" />
                    <Line x1="7" y1="14" x2="15" y2="22" />
                  </G>
                </G>
              </Svg>
            </View>
          </RN.TouchableOpacity>
          <View style={styles.dropdownContainer}>
            {this.state.isOpen && (
              <View style={styles.dropdown} align="flex-start">
                {Object.keys(this.options)
                  .filter(key => this.props.filter !== key)
                  .map(key => (
                    <BaseBtn
                      onPress={() => this.onOptionSelect(key)}
                      style={styles.dropdownOption}
                      label={this.options[key]}
                      size="medium"
                      key={key}
                      py={1.5}
                    />
                  ))}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = RN.StyleSheet.create({
  dropdownContainer: {
    position: 'relative'
  },
  dropdownBtn: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  dropdown: {
    backgroundColor: theme.colors.dark,
    borderRadius: 4,
    borderTopRightRadius: 0,
    position: 'absolute',
    right: 0,
    width: 160,
    alignItems: 'stretch'
  },
  dropdownOption: {
    paddingHorizontal: theme.spacing(3)
  }
});

export default TxListHeader;
