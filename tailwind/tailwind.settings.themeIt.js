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
      'sm-grey': '#E3DED8',
      'sm-greydark': '#96908A',
      'sm-bordeaux': '#781524',
      'sm-rosa': '#EDB8B4',
      'sm-orange': '#EF7A4D',
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
