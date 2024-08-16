/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["selector" , '[data-color-scheme="dark"]'],
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn .5s ease-in-out forwards',
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
      },
      gridTemplateRows: {
        'layout': '64px 1fr fit-content(100%)',
        'code-layout': '64px 1fr',
      },
      gridTemplateColumns: {
        'chainSelect': '276fr 708fr',
      },
      colors: {
        "dev-pink" : {
          600: '#A80059',
          500: '#E6007A',
          400: '#FF2D9C',
          300: '#FF70BC',
        },
        "dev-purple" : {
          950: "#140523",
          925: "#160527",
          900: "#1C0533",
          800: "#28123E",
          700: "#492C65",
          600: "#442299",
          500: "#552BBF",
          400: "#6D3AEE",
          300: "#DAE0F2",
          200: "#E6EAF6",
          100: "#F3F5FB",
          50: "#FBFCFE",
        },
        "dev-cyan" : {
          700: '#0094D4',
          600: '#00A6ED',
          500: '#00B2FF',
        },
        "dev-green" : {
          700: '#48CC81',
          600: '#51E591',
          500: '#56F39A',
        },
        "dev-lime" : {
          700: '#A9CC29',
          600: '#BEE52E',
          500: '#D3FF33',
        },
        "dev-red" : {
          700: '#EA2727',
          600: '#FF5353',
          500: '#FF9797',
        },
        "dev-black" : {
          1000: '#000000',
          950: '#0C0C0C',
          900: '#111111',
          800: '#151515',
          700: '#222222',
          600: '#252525',
          500: '#333333',
          400: '#353535',
          300: '#444444',
          200: '#454545',
          200: '#555555',
        },
        "dev-white" : {
          1000: '#BBBBBB',
          900: '#CCCCCC',
          800: '#DDDDDD',
          700: '#EDEDED',
          600: '#EEEEEE',
          500: '#EFEFEF',
          400: '#F1F1F1',
          300: '#F5F5F5',
          200: '#F9F9F9',
          200: '#FFFFFF',
        },
      },
      fontFamily: {
        popins: ['"Poppins"',  ...defaultTheme.fontFamily.sans],
        geist: ['"Geist"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    ({ addUtilities }) => {
      const newUtilities = {
        '.font-h1-extraLight': {
          fontSize: '4rem',
          lineHeight: '5rem',
          fontWeight: '275',
        },
        '.font-h1-regular': {
          fontSize: '4rem',
          lineHeight: '5rem',
          fontWeight: '400',
        },
        '.font-h1-bold': {
          fontSize: '4rem',
          lineHeight: '5rem',
          fontWeight: '600',
        },
        '.font-h2-extraLight': {
          fontSize: '3rem',
          lineHeight: '4rem',
          fontWeight: '275',
        },
        '.font-h2-regular': {
          fontSize: '3rem',
          lineHeight: '4rem',
          fontWeight: '400',
        },
        '.font-h2-bold': {
          fontSize: '3rem',
          lineHeight: '4rem',
          fontWeight: '600',
        },
        '.font-h3-extraLight': {
          fontSize: '2rem',
          lineHeight: '3rem',
          fontWeight: '300',
        },
        '.font-h3-regular': {
          fontSize: '2rem',
          lineHeight: '3rem',
          fontWeight: '400',
        },
        '.font-h3-bold': {
          fontSize: '2rem',
          lineHeight: '3rem',
          fontWeight: '600',
        },
        '.font-h4-light': {
          fontSize: '1.5rem',
          lineHeight: '1.98rem',
          fontWeight: '300',
        },
        '.font-h4-regular': {
          fontSize: '1.5rem',
          lineHeight: '1.98rem',
          fontWeight: '400',
        },
        '.font-h4-bold': {
          fontSize: '1.5rem',
          lineHeight: '1.98rem',
          fontWeight: '600',
        },
        '.font-h5-light': {
          fontSize: '1.125rem',
          lineHeight: '1.53rem',
          fontWeight: '300',
        },
        '.font-h5-regular': {
          fontSize: '1.125rem',
          lineHeight: '1.53rem',
          fontWeight: '400',
        },
        '.font-h5-bold': {
          fontSize: '1.125rem',
          lineHeight: '1.53rem',
          fontWeight: '600',
        },
        '.font-body1-regular': {
          fontSize: '1rem',
          lineHeight: '1.5rem',
          fontWeight: '400',
        },
        '.font-body1-bold': {
          fontSize: '1rem',
          lineHeight: '1.5rem',
          fontWeight: '700',
        },
        '.font-body2-regular': {
          fontSize: '0.875rem',
          lineHeight: '1.278rem',
          fontWeight: '400',
        },
        '.font-body2-bold': {
          fontSize: '0.875rem',
          lineHeight: '1.278rem',
          fontWeight: '700',
        },
        '.font-body3-regular': {
          fontSize: '0.75rem',
          lineHeight: '1.02rem',
          fontWeight: '400',
        },
        '.font-body3-bold': {
          fontSize: '0.75rem',
          lineHeight: '1.02rem',
          fontWeight: '700',
        },
        '.font-body4-regular': {
          fontSize: '0.625rem',
          lineHeight: '0.9rem',
          fontWeight: '400',
        },
        '.font-body4-bold': {
          fontSize: '0.625rem',
          lineHeight: '0.9rem',
          fontWeight: '700',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
    ({ addUtilities }) => {
      const newUtilities = {
        '.animation-duration-100': {
          'animation-duration': '150ms',
        },
        '.animation-delay-100': {
          'animation-delay': '150ms',
        },
        '.animation-duration-200': {
          'animation-duration': '200ms',
        },
        '.animation-delay-200': {
          'animation-delay': '200ms',
        },
        '.animation-duration-300': {
          'animation-duration': '300ms',
        },
        '.animation-delay-300': {
          'animation-delay': '300ms',
        },
        '.animation-duration-500': {
          'animation-duration': '500ms',
        },
        '.animation-delay-500': {
          'animation-delay': '500ms',
        },
        '.animation-duration-700': {
          'animation-duration': '700ms',
        },
        '.animation-delay-700': {
          'animation-delay': '700ms',
        },
        '.animation-duration-1000': {
          'animation-duration': '1000ms',
        },
        '.animation-delay-1000': {
          'animation-delay': '1000ms',
        },
      };


      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
