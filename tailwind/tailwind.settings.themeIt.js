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
      primary: colors.green,
      secondary: colors.emerald,
      'bp-primary': '#FF0000',
      'bp-secondary': '#00FF00',
      'bp-accent': '#EF7A4D',
      'bp-background': '#EDB8B4',
      'bp-text': '#000000',
      'bp-error': '#FF0000',
      'bp-success': '#00FF00',
      'bp-warning': '#EF7A4D',
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
