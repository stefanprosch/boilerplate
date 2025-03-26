/*
 * Tailwind Theme it Settings
 */

import colors from 'tailwindcss/colors';

export default [
  {
    name: 'default',
    colors: {
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,
      'keyboard-focus': '#ff98de',
      gray: colors.zinc,
      primary: '#FF6B2B',
      secondary: '#FF6B2B',
      neutral: '#4A4A4A',
      accent: '#40E0D0',
      background: '#FFFFFF',
      text: '#000000',
      error: '#FF6B2B',
      success: '#FF6B2B',
      warning: '#FF6B2B',
    },
  },
  {
    name: 'dark',
    colors: {
      primary: '#000000',
      secondary: colors.stone,
    },
  },
  {
    name: 'monochrome',
    colors: {
      primary: colors.neutral,
      secondary: colors.stone,
    },
  },
  {
    name: 'blue',
    colors: {
      primary: colors.blue,
      secondary: colors.sky,
    },
  },
  {
    name: 'red',
    colors: {
      primary: colors.red,
      secondary: colors.rose,
    },
  },
  {
    name: 'purple',
    colors: {
      primary: colors.purple,
      secondary: colors.violet,
    },
  },
];
