import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        persona: {
          bg: "#0A0908", // Deep Black
          text: "#E3D5CA", // Cream/Sand
          accent: "#E3D5CA",
          border: "#E3D5CA",
          hover: "rgba(227, 213, 202, 0.1)", // Low opacity cream for hovers
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Inter", "sans-serif"],
        arabic: ["IBM Plex Sans Arabic", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 10px rgba(227, 213, 202, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "shimmer": "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
