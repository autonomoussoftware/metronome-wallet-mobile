import SVG, { Path, Rect } from 'react-native-svg'
import PropTypes from 'prop-types'
import theme from '../../theme'
import React from 'react'

export default class LogoIcon extends React.Component {
  static propTypes = {
    negative: PropTypes.bool
  }

  render() {
    const { negative, ...other } = this.props
    return (
      <SVG viewBox="0 0 32 32" width="32" height="32" {...other}>
        <Rect
          opacity=".3"
          height="32"
          width="32"
          fill={negative ? theme.colors.light : theme.colors.dark}
          rx="12"
        />
        <Path
          fill={negative ? theme.colors.dark : theme.colors.light}
          d="M15.913 11.888A4.942 4.942 0 0 0 12.03 10C9.304 10 7 12.268 7 14.954v5.953C7 21.47 7.543 22 8.119 22c.588 0 1.067-.49 1.067-1.093v-5.953c.027-1.554 1.276-2.769 2.844-2.769a2.739 2.739 0 0 1 2.767 2.766v5.956c.014.604.508 1.093 1.093 1.093.614 0 1.093-.49 1.093-1.093v-5.953c.027-1.554 1.276-2.769 2.843-2.769a2.739 2.739 0 0 1 2.768 2.769v5.953c0 .592.5 1.093 1.092 1.093.582 0 1.093-.51 1.093-1.093v-5.953A4.959 4.959 0 0 0 19.826 10c-1.562 0-2.983.747-3.913 1.888z"
        />
      </SVG>
    )
  }
}
