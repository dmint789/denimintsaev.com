/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        mygray: {
          50: '#eeeeee',
          100: '#dddddd',
          200: '#cccccc',
          300: '#bbbbbb',
          400: '#a9a9a9',
          500: '#959595',
          600: '#7c7c7c',
          700: '#5c5c5c',
          800: '#414141',
          900: '#222222',
        },
      },
    },
  },
  css: ['~/assets/css/main.css', '~/assets/css/kanjiSorter.css'],
  plugins: [],
  purge: {
    enabled: true,
    options: {
      safelist: [
        'p-1',
        'p-2',
        'p-3',
        'p-4',
        'p-5',
        'text-xl',
        'text-2xl',
        'text-3xl',
        'text-4xl',
        'text-5xl',
        'text-black',
        'text-white',
      ],
    },
  },
};
