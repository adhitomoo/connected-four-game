const path = require('path');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require("tailwindcss/plugin");
const { transform } = require('typescript');
// const generatePalette = require(path.resolve(__dirname, ('src/@fuse/tailwind/utils/generate-palette')));

/**
 * Custom palettes
 *
 * Uses the generatePalette helper method to generate
 * Tailwind-like color palettes automatically
 */
// const customPalettes = {
//   brand: generatePalette('#2196F3')
// };

/**
 * Themes
 */
const themes = {
  // Default theme is required for theming system to work correctly!
  'default': {
    primary  : {
      ...colors.indigo,
      DEFAULT: colors.indigo[600]
    },
    accent   : {
      ...colors.slate,
      DEFAULT: colors.slate[800]
    },
    warn     : {
      ...colors.red,
      DEFAULT: colors.red[600]
    },
    'on-warn': {
      500: colors.red['50']
    }
  },
};

/**
 * Tailwind configuration
 */
const config = {
  darkMode   : 'selector',
  content    : ['./src/**/*.{html,scss,ts}'],
  important  : true,
  variants: {
    extend: {
      transform: ['group-hover'],
      scale: ['group-hover'],
      display: ['group-hover'],}
  },
  theme      : {
    fontSize: {
      'xs'  : '0.625rem',
      'sm'  : '0.75rem',
      'md'  : '0.8125rem',
      'base': '0.875rem',
      'lg'  : '1rem',
      'xl'  : '1.125rem',
      '2xl' : '1.25rem',
      '3xl' : '1.5rem',
      '4xl' : '2rem',
      '5xl' : '2.25rem',
      '6xl' : '2.5rem',
      '7xl' : '3rem',
      '8xl' : '4rem',
      '9xl' : '6rem',
      '10xl': '8rem'
    },
    screens : {
      xs: '360px',
      sm: '600px',
      md: '960px',
      lg: '1280px',
      xl: '1440px'
    },
    extend  : {
      animation               : {
        'spin-slow': 'spin 3s linear infinite'
      },
      keyframes: {
        progress: {
          '0%': { transform: ' translateX(0) scaleX(0)' },
          '40%': { transform: 'translateX(0) scaleX(0.4)' },
          '100%': { transform: 'translateX(100%) scaleX(0.5)' },
        },
      },
      transformOrigin: {
        'left-right': '0% 50%',
      },
      colors                  : {
        gray: colors.slate,
        'primary': '#5C2DD5',
        'secondary': '#7945FF',
        'primary-black': '#000000',
        'primary-pink': '#FD6687',
        'primary-yellow': '#FFCE67',
        'primary-white': '#FFFFFF'
      },
      flex                    : {
        '0': '0 0 auto'
      },
      fontFamily              : {
        sans: `"Space Grotesk", ${defaultTheme.fontFamily.sans.join(',')}`,
        // mono: `"IBM Plex Mono", ${defaultTheme.fontFamily.mono.join(',')}`
      },
      opacity                 : {
        12: '0.12',
        38: '0.38',
        87: '0.87'
      },
      borderWidth             : {
        14: '14px'
      },
      borderRadius                : {
        '4xl': '3.5rem'
      },
      rotate                  : {
        '-270': '270deg',
        '15'  : '15deg',
        '30'  : '30deg',
        '60'  : '60deg',
        '270' : '270deg'
      },
      scale                   : {
        '-1': '-1',
        '50': '.5',
        '200': '2'
      },
      zIndex                  : {
        '-1'   : -1,
        '49'   : 49,
        '60'   : 60,
        '70'   : 70,
        '80'   : 80,
        '90'   : 90,
        '99'   : 99,
        '999'  : 999,
        '9999' : 9999,
        '99999': 99999
      },
      spacing                 : {
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '50': '12.5rem',
        '90': '22.5rem',

        // Bigger values
        '100': '25rem',
        '120': '30rem',
        '128': '32rem',
        '140': '35rem',
        '160': '40rem',
        '180': '45rem',
        '192': '48rem',
        '200': '50rem',
        '240': '60rem',
        '256': '64rem',
        '280': '70rem',
        '320': '80rem',
        '360': '90rem',
        '400': '100rem',
        '480': '120rem',

        // Fractional values
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%'
      },
      minHeight               : ({theme}) => ({
        ...theme('spacing')
      }),
      maxHeight               : {
        none: 'none'
      },
      minWidth                : ({theme}) => ({
        ...theme('spacing'),
        screen: '100vw'
      }),
      maxWidth                : ({theme}) => ({
        ...theme('spacing'),
        screen: '100vw'
      }),
      transitionDuration      : {
        '400': '400ms'
      },
      transitionTimingFunction: {
        'drawer': 'cubic-bezier(0.25, 0.8, 0.25, 1)'
      },
    },
  },
  corePlugins: {
    appearance        : false,
    container         : false,
    float             : false,
    clear             : false,
    placeholderColor  : false,
    placeholderOpacity: false,
    verticalAlign     : false
  },
  plugins    : [
    // Other third party and/or custom plugins
    // require('@tailwindcss/typography')({modifiers: ['sm', 'lg']})
    plugin(function({ matchUtilities }) {
      matchUtilities(
        {
          'x': (value) => ({
            [`@apply ${value.replaceAll(',', ' ')}`]: {}
          })
        }
      )
    })
  ]
};


module.exports = config;
