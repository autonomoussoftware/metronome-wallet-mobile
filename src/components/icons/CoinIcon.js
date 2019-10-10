import { Circle, Svg, Path, G } from 'react-native-svg'
import PropTypes from 'prop-types'
import React from 'react'

const ETH = isTest => (
  <G fill="none" fillRule="evenodd">
    <Circle cx="12" cy="12" r="12" fill="#FFF" fillRule="nonzero" />
    <G fillRule="nonzero">
      <Path
        fill={isTest ? '#2dc62d' : '#7E61F8'}
        d="M12.288 11.6H6.75L12.288 3l5.539 8.6z"
      />
      <Path
        fill={isTest ? '#27a327' : '#644DC6'}
        d="M12.288 14.096L6.75 11.6l5.538-2.767 5.539 2.767z"
      />
      <G>
        <Path
          fill={isTest ? '#2dc62d' : '#7E61F8'}
          d="M12.288 15.32L6.75 12.4l5.538 8.6 5.539-8.6z"
        />
        <Path
          fill={isTest ? '#27a327' : '#644DC6'}
          d="M12.288 15.32V21l5.539-8.6z"
        />
      </G>
    </G>
  </G>
)

const ETC = isTest => (
  <G fill="none" fillRule="evenodd">
    <Circle cx="12" cy="12" r="12" fill="#FFF" fillRule="nonzero" />
    <Path
      fill="gray"
      fillRule="nonzero"
      d="M6.916 12.138s.028 0 0 0c.028 0 .028 0 0 0 0 .028 0 .028 0 0z"
    />
    <G fillRule="nonzero">
      <Path
        fill={isTest ? '#2dc62d' : '#7E61F8'}
        d="M12.288 8.68L6.75 11.6 12.288 3l5.539 8.6z"
      />
      <Path
        fill={isTest ? '#27a327' : '#644DC6'}
        d="M12.288 8.68V3l5.539 8.6z"
      />
      <Path
        fill={isTest ? '#2dc62d' : '#7E61F8'}
        d="M12.288 15.32L6.75 12.4l5.538 8.6 5.539-8.6z"
      />
      <Path
        fill={isTest ? '#27a327' : '#644DC6'}
        d="M12.288 15.32V21l5.539-8.6z"
      />
      <G>
        <Path
          fill={isTest ? '#2dc62d' : '#7E61F8'}
          d="M12.288 10.2l4.708 1.8-4.708 1.8L7.581 12z"
        />
        <Path
          fill={isTest ? '#27a327' : '#644DC6'}
          d="M16.996 12l-4.708 1.8L7.581 12z"
        />
      </G>
    </G>
  </G>
)

const CoinIcon = ({ coin, ...other }) => (
  <Svg viewBox="0 0 24 24" {...other} width="24" height="24">
    {coin === 'ethRopstenLocal' && ETH('local')}
    {coin === 'etcMordorLocal' && ETC('local')}
    {coin === 'ethMainnet' && ETH()}
    {coin === 'ethRopsten' && ETH('test')}
    {coin === 'etcMainnet' && ETC()}
    {coin === 'etcMordor' && ETC('test')}
  </Svg>
)

CoinIcon.propTypes = {
  coin: PropTypes.oneOf([
    'ethRopstenLocal',
    'etcMordorLocal',
    'ethMainnet',
    'ethRopsten',
    'etcMainnet',
    'etcMordor'
  ]).isRequired
}

export default CoinIcon
