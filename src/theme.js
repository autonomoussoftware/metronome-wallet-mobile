const darkShade = 'rgba(0, 0, 0, 0.2)'

export default {
  colors: {
    transparent: 'transparent',
    primary: '#7e61f8',
    translucentPrimary: 'rgba(126, 97, 248, 0.2)',
    light: '#fff',
    copy: '#545454',
    dark: '#323232',
    translucentDark: '#323232EE',
    lightShade: 'rgba(0, 0, 0, 0.1)',
    darkShade,
    success: '#45d48d',
    danger: '#d46045',
    weak: '#888',

    // BACKGROUNDS
    medium: '#f4f4f4',
    lightBG: '#ededed',
    xLight: '#f7f7f7',
    darkGradient: 'linear-gradient(to bottom, #353535, #323232)'
  },

  // SIZES
  sizes: {
    xSmall: 12,
    small: 14,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 32
  },

  textShadow: `0 1px 1px ${darkShade}`,
  spacing: n => n * 8 // used as rem multiplier
}
