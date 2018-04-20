import { View, Text } from './common'
import React from 'react'
import RN from 'react-native'

export default class Loading extends React.Component {
  render() {
    return (
      <View flex={1} bg="dark">
        <RN.StatusBar barStyle="light-content" />
        <RN.ImageBackground
          source={require('../assets/images/pattern.png')}
          style={styles.bg}
        >
          <View flex={1} justify="center" align="center">
            <Text size="large" mb={2}>
              Contacting Network...
            </Text>
            <RN.ActivityIndicator size="large" />
          </View>
        </RN.ImageBackground>
      </View>
    )
  }
}

const styles = RN.StyleSheet.create({
  bg: {
    flex: 1
  }
})
