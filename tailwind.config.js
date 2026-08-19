/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C3AED",
          light: "#A78BFA",
          dark: "#5B21B6",
        },
        accent: {
          DEFAULT: "#F59E0B",
          light: "#FDE68A",
          dark: "#D97706",
        },
        surface: "#F5F3FF",
        card: "#FFFFFF",
        foreground: "#18181B",
        muted: "#71717A",
        border: "#E4E4E7",
        danger: "#EF4444",
        success: "#10B981",
        online: "#22C55E",
      },
      fontFamily: {
        display: ["Nunito_800ExtraBold"],
        "display-bold": ["Nunito_700Bold"],
        "display-semi": ["Nunito_600SemiBold"],
        "display-medium": ["Nunito_500Medium"],
        "display-regular": ["Nunito_400Regular"],
        body: ["Poppins_400Regular"],
        "body-medium": ["Poppins_500Medium"],
        "body-semi": ["Poppins_600SemiBold"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
