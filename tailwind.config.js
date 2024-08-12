const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans]
      },
    // fontSize: {
    //   sm: '1.2rem',
    //   base: '1.5rem',
    //   xl: '2.0rem',
    //   '2xl': '1.563rem',
    //   '3xl': '1.953rem',
    //   '4xl': '2.441rem',
    //   '5xl': '3.052rem',
    // },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          '0%': {opacity: 0},
          '50%': {opacity: 0},
          '100%': {opacity: 100}
        },
        "fade-out": {
          from: {opacity: 100},
          to: {opacity: 0}
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in05s": "fade-in 0.5s",
        "fade-in1s": "fade-in 1s"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}