/*
 * Opatciy Map for Colors
 * https://www.viget.com/articles/tips-for-your-tailwind-config/
 * */

/** @type {import('tailwindcss').Config} */

// plugins
import containerQuerries from '@tailwindcss/container-queries';
// import themeIt from 'tailwindcss-theme-it';
import fluidType from 'tailwindcss-fluid-type';
import debugScreens from 'tailwindcss-debug-screens';
import forms from '@tailwindcss/forms';
import components from './tailwind/tailwind.plugins.addComponents';

// Settings
import settingsGrid from './tailwind/tailwind.settings.grid';
import settingsfluidType from './tailwind/tailwind.settings.fluidType';
import settingsThemeIt from './tailwind/tailwind.settings.themeIt';

export default {
  content: ['./templates/**/*.{twig,html,vue,js,ts,json}', './src/vue/**/*.{vue,js,ts}'],
  safelist: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Helvetica', 'Arial', 'sans-serif'],
      serif: ['Georgia', 'Times New Roman', 'Times', 'serif'],
      mono: ['"Courier New"', 'Courier', 'monospace'],
    },
    fontSize: {
      '2xs': '0.5rem',
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      nthover: { raw: '(hover: hover)' },
    },
    extend: {
      gridTemplateColumns: { ...settingsGrid.gridTemplateColumns },
      gridColumn: { ...settingsGrid.gridColumn },
      gridRowStart: { ...settingsGrid.gridRowStart },
      gridRowEnd: { ...settingsGrid.gridRowEnd },
      aspectRatio: {
        landscape: '3 / 2',
        portrait: '2 / 3',
      },
      transitionTimingFunction: {
        'out-back': 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
      },
    },
    // Plugin Stuff
    debugScreens: {
      ignore: ['nthover'],
      position: ['bottom', 'right'],
    },
  },
  variants: {},
  corePlugins: {
    container: false,
    fontSize: false, // disable because we use the fluid type plugin
  },
  plugins: [
    containerQuerries,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // themeIt(settingsThemeIt),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    fluidType({
      ...settingsfluidType,
    }),
    debugScreens,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    forms({
      strategy: 'class',
    }),
    ({ addComponents }) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      addComponents(components);
    },
  ],
}
