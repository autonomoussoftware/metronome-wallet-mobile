import { withRouter } from 'react-router-native';
import PropTypes from 'prop-types';
import React from 'react';
import View from './View';
import RN from 'react-native';

const windowWidth = RN.Dimensions.get('window').width;

function getPageIndexFromPath(props) {
  return Object.keys(props.pages).findIndex(
    path => path === props.location.pathname
  );
}

/**
 * Usage:
 *   <RouterPager
 *     duration={1000}
 *     pages={{
 *       '/auction': AuctionComponent,
 *       '/auction/buy': BuyMETForm
 *     }}
 *   />
 */

class RoutePager extends React.PureComponent {
  static propTypes = {
    duration: PropTypes.number,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    pages: PropTypes.objectOf(PropTypes.func).isRequired
  };

  static defaultProps = {
    duration: 300
  };

  state = { currentPage: getPageIndexFromPath(this.props), nextPage: null };

  anims = Object.keys(this.props.pages).map(
    (_, i) => new RN.Animated.Value(i === this.state.currentPage ? 1 : 0)
  );

  getTranslateX = page =>
    this.anims[page].interpolate({
      inputRange: [0, 1, 2],
      outputRange: [windowWidth, 0, windowWidth * -0.5]
    });

  getOpacity = page =>
    this.anims[page].interpolate({
      inputRange: [0, 1, 2],
      outputRange: [1, 1, 0.35]
    });

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextPage = getPageIndexFromPath(nextProps);
    if (
      nextPage === prevState.currentPage ||
      nextPage === prevState.nextPage ||
      nextPage === -1
    ) {
      return null;
    }
    return { nextPage };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.nextPage !== this.state.nextPage &&
      this.state.nextPage !== null
    ) {
      this.gotoPage(this.state.nextPage);
    }
  }

  gotoPage = nextPage => {
    const { currentPage } = this.state;
    const reverse = currentPage > nextPage;
    if (reverse) this.anims[nextPage].setValue(2);
    RN.Animated.parallel([
      RN.Animated.timing(this.anims[this.state.currentPage], {
        useNativeDriver: true,
        duration: this.props.duration,
        toValue: reverse ? 0 : 2
      }),
      RN.Animated.timing(this.anims[nextPage], {
        useNativeDriver: true,
        duration: this.props.duration,
        toValue: 1
      })
    ]).start(({ finished }) => {
      if (finished) {
        this.anims[currentPage].setValue(0);
        this.setState({ currentPage: nextPage, nextPage: null });
      }
    });
  };

  getPageStatus = page => {
    const { currentPage, nextPage } = this.state;
    if (page === nextPage) return 'entering';
    if (page === currentPage && nextPage === null) return 'entered';
    if (page === currentPage && nextPage !== null) return 'exiting';
    return 'offscreen';
  };

  render() {
    return (
      <View flex={1} style={styles.container}>
        {Object.values(this.props.pages).map((ViewComponent, i) => (
          <RN.Animated.View
            key={i}
            style={[
              styles.item,
              {
                opacity: this.getOpacity(i),
                transform: [{ translateX: this.getTranslateX(i) }]
              }
            ]}
          >
            <ViewComponent pageStatus={this.getPageStatus(i)} index={i} />
          </RN.Animated.View>
        ))}
      </View>
    );
  }
}

const styles = RN.StyleSheet.create({
  container: {
    position: 'relative'
  },
  item: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});

export default withRouter(RoutePager);
