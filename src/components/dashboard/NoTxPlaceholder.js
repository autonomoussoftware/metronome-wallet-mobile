import { Svg, G, Circle, Path } from 'react-native-svg'
import React from 'react'
import RN from 'react-native'

import { View, Text } from '../common'

export default class NoTxPlaceholder extends React.Component {
  render() {
    return (
      <View bg="light" flex={1}>
        <RN.ImageBackground
          resizeMode="cover"
          source={require('../../assets/images/pattern-light.png')}
          style={styles.bg}
        >
          <View align="center" py={6} px={2}>
            <Svg width="48" height="48" viewBox="0 0 48 48">
              <G fill="none" fillRule="evenodd">
                <Circle cx="24" cy="24" r="23" fill="#FFF" />
                <Path
                  fillRule="nonzero"
                  fill="#B6BABF"
                  d="M24 48C10.76 48 0 37.24 0 24S10.76 0 24 0s24 10.76 24 24
                     -10.76 24-24 24zm0-46.098C11.817 1.902 1.902 11.817 1.902
                     24S11.817 46.098 24 46.098 46.098 36.183 46.098 24 36.183
                     1.902 24 1.902zm0 34.588c-5.86 0-10.568-5.784-10.568-10.568
                     0-.538.422-.961.96-.961h19.216c.538 0 .96.423.96.96 0 4.785
                     -4.707 10.569-10.568 10.569zm-8.57-9.608c.576 3.67 4.285
                     7.686 8.57 7.686s7.994-4.016 8.57-7.686H15.43zm22.982-7.686
                     H36.49a3.854 3.854 0 0 0-3.843-3.843 3.854 3.854 0 0 0
                     -3.843 3.843h-1.922c0-3.17 2.594-5.764 5.765-5.764 3.17 0
                     5.765 2.594 5.765 5.764zm-17.294 0h-1.922a3.854 3.854 0 0 0
                     -3.843-3.843 3.854 3.854 0 0 0-3.843 3.843H9.588c0-3.17 
                     2.595-5.764 5.765-5.764 3.17 0 5.765 2.594 5.765 5.764z"
                />
              </G>
            </Svg>
            <Text
              opacity={0.75}
              weight="semibold"
              color="copy"
              size="large"
              mt={1}
            >
              No transactions yet!
            </Text>
          </View>
        </RN.ImageBackground>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  bg: {
    justifyContent: 'center',
    flex: 1
  }
})
