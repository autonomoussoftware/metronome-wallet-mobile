import theme from '../theme';
import React from 'react';
import Text from './common/Text';
import RN from 'react-native';

export default class Loading extends React.Component {
  render() {
    return (
      <RN.View style={styles.container}>
        <RN.StatusBar barStyle="light-content" />
        <RN.ImageBackground
          source={require('../assets/images/pattern.png')}
          style={styles.bg}
        >
          <RN.View style={styles.content}>
            <Text size="large" mb={2}>
              Contacting Network...
            </Text>
            <RN.ActivityIndicator size="large" />
          </RN.View>
        </RN.ImageBackground>
      </RN.View>
    );
  }
}

const styles = RN.StyleSheet.create({
  container: {
    backgroundColor: theme.colors.dark,
    flex: 1
  },
  bg: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
