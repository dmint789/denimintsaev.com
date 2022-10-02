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
        'py-2',
        'py-4',
        'py-6',
        'py-8',
        'pb-1',
        'pb-2',
        'pb-3',
        'pb-4',
        'pb-5',
        'w-36',
        'w-40',
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
