export const theme = {
  bg: '#080714',
  surface: 'rgba(255,255,255,0.03)',
  border: 'rgba(255,255,255,0.06)',

  lavender: 'rgba(200,180,255,0.85)',
  lavenderDim: 'rgba(200,180,255,0.45)',
  lavenderFaint: 'rgba(200,180,255,0.15)',

  purple: '#7B5EA7',
  purpleLight: '#B481BB',
  purpleGradient: ['#7B5EA7', '#B481BB'],

  blue: '#58B2DC',
  teal: '#00AA90',
  coral: '#F17C67',

  text: 'rgba(255,255,255,0.88)',
  textDim: 'rgba(255,255,255,0.5)',
  textFaint: 'rgba(255,255,255,0.25)',

  fontSerif: 'Georgia',
  fontSans: 'Inter',

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 },
  borderRadius: { sm: 8, md: 14, lg: 20, xl: 28, full: 999 },

  shadow: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16 },
    glow: (color = '#7B5EA7') => ({ shadowColor: color, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 24 }),
  },

  animation: {
    spring: { tension: 180, friction: 15 },
  },
};
