import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        mutedInk: "#465066",
        brand: {
          50: "#EFFAF7",
          100: "#D8F3EC",
          200: "#B3E7DA",
          300: "#7DD7C1",
          400: "#39C1A0",
          500: "#14A387",
          600: "#0F826D",
          700: "#0E6758",
          800: "#0E5348",
          900: "#0C433B"
        },
        sun: {
          50: "#FFF9EC",
          100: "#FFF0CC",
          200: "#FFE199",
          300: "#FFD066",
          400: "#FFBC2E",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(11,18,32,0.08)"
      }
    },
  },
  plugins: [],
} satisfies Config;
