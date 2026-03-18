/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          500: '#1e3a6e',
          600: '#162d58',
          700: '#0F172A',
          800: '#0a1020',
          900: '#060c18',
        },
        gold: {
          400: '#fbbf24',
          500: '#F59E0B',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
