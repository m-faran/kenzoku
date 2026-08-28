/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        accent: '#F59E0B',
        surface: '#F5F3FF',
        card: '#FFFFFF',
        foreground: '#18181B',
        muted: '#71717A',
        border: '#E5E7EB'
      },
      fontFamily: {
        display: ['Nunito_800ExtraBold'],
        body: ['Poppins_400Regular'],
        'body-medium': ['Poppins_500Medium'],
        'body-semi': ['Poppins_600SemiBold'],
      }
    },
  },
  plugins: [],
};
