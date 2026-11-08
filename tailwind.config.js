/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Ink & Paper + One Signal Color system
        primary: '#FF3B1D',      // International Orange — ONLY for tappable focal actions
        signal: '#FF3B1D',       // Alias for explicit signal usage
        accent: '#111111',       // Deep ink (replaces decorative amber)
        surface: '#F6F3EC',      // Warm editorial paper background
        paper: '#F6F3EC',        // Explicit paper token
        'paper-sunken': '#EAE5D9', // Pressed warm stone plane
        card: '#FCFBF7',         // Elevated warm ivory sheet
        foreground: '#111111',   // Deep carbon ink
        ink: '#111111',          // Explicit ink token
        muted: '#68645D',        // Warm stone secondary ink (≥4.5:1 on paper)
        border: '#DCD6CA',       // 1px editorial hairline rule
        danger: '#D92D20',       // Destructive action red
        online: '#16A34A',       // Online status indicator
      },
      fontFamily: {
        display: ['Syne_800ExtraBold'],
        'display-bold': ['SpaceGrotesk_700Bold'],
        body: ['SpaceGrotesk_400Regular'],
        'body-medium': ['SpaceGrotesk_500Medium'],
        'body-semi': ['SpaceGrotesk_600SemiBold'],
        'body-bold': ['SpaceGrotesk_700Bold'],
      }
    },
  },
  plugins: [],
};
