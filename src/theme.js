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
    darkSuccess: 'rgba(119, 132, 125, 0.68)',
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
    xSmall: 11,
    small: 14,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 32
  },

  // FONT WEIGHTS
  weights: {
    xLight: { fileName: 'Muli-ExtraLight', value: '200' },
    light: { fileName: 'Muli-Light', value: '300' },
    regular: { fileName: 'Muli-Regular', value: '400' },
    semibold: { fileName: 'Muli-SemiBold', value: '600' },
    bold: { fileName: 'Muli-Bold', value: '700' },
    xBold: { fileName: 'Muli-ExtraBold', value: '800' },
    black: { fileName: 'Muli-Black', value: '900' }
  },

  textShadow: `0 1px 1px ${darkShade}`,
  spacing: n => n * 8 // used as rem multiplier
}
