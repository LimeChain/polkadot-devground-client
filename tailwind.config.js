/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["selector" , '[data-color-scheme="dark"]'],
  theme: {
    extend: {
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
        geist: ['"Geist"',  ...defaultTheme.fontFamily.sans]
      },
      fontSize : {
        "h1-extraLight" : ["4rem" , {
          lineHeight: '5rem',
          fontWeight: '275',
        }],
        "h1-regular" : ["4rem" , {
          lineHeight: '5rem',
          fontWeight: '400',
        }],
        "h1-bold" : ["4rem" , {
          lineHeight: '5rem',
          fontWeight: '600',
        }],
        "h2-extraLight" : ["3rem" , {
          lineHeight: '4rem',
          fontWeight: '275',
        }],
        "h2-regular" : ["3rem" , {
          lineHeight: '4rem',
          fontWeight: '400',
        }],
        "h2-bold" : ["3rem" , {
          lineHeight: '4rem',
          fontWeight: '600',
        }],
        "h3-extraLight" : ["2rem" , {
          lineHeight: '3rem',
          fontWeight: '300',
        }],
        "h3-regular" : ["2rem" , {
          lineHeight: '3rem',
          fontWeight: '400',
        }],
        "h3-bold" : ["2rem" , {
          lineHeight: '3rem',
          fontWeight: '600',
        }],
        "h4-light" : ["1.5rem" , {
          lineHeight: '1.98rem',
          fontWeight: '300',
        }],
        "h4-regular" : ["1.5rem" , {
          lineHeight: '1.98rem',
          fontWeight: '400',
        }],
        "h4-bold" : ["1.5rem" , {
          lineHeight: '1.98rem',
          fontWeight: '600',
        }],
        "h5-light" : ["1.125rem" , {
          lineHeight: '1.53rem',
          fontWeight: '300',
        }],
        "h5-regular" : ["1.125rem" , {
          lineHeight: '1.53rem',
          fontWeight: '400',
        }],
        "h5-bold" : ["1.125rem" , {
          lineHeight: '1.53rem',
          fontWeight: '600',
        }],
        "body1-regular" : ["1rem" , {
          lineHeight: '1.5rem',
          fontWeight: '400',
        }],
        "body1-bold" : ["1rem" , {
          lineHeight: '1.5rem',
          fontWeight: '700',
        }],
        "body2-regular" : ["0.875rem" , {
          lineHeight: '1.278rem',
          fontWeight: '400',
        }],
        "body2-bold" : ["0.875rem" , {
          lineHeight: '1.278rem',
          fontWeight: '700',
        }],
        "body3-regular" : ["0.75rem" , {
          lineHeight: '1.02rem',
          fontWeight: '400',
        }],
        "body3-bold" : ["0.75rem" , {
          lineHeight: '1.02rem',
          fontWeight: '700',
        }],
        "body4-regular" : ["0.625rem" , {
          lineHeight: '0.9rem',
          fontWeight: '400',
        }],
        "body4-bold" : ["0.625rem" , {
          lineHeight: '0.9rem',
          fontWeight: '700',
        }],
      }
    },
  },
  plugins: [],
};
