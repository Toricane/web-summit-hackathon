/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        app: "#000000",
        card: {
          DEFAULT: "#15151A",
          muted: "#0F0F12",
          elevated: "#1C1C22",
        },
        line: "#26262E",
        ink: {
          DEFAULT: "#FFFFFF",
          muted: "#A1A1AA",
          subtle: "#71717A",
        },
        brand: {
          DEFAULT: "#7C5CFF",
          light: "#A790FF",
          dark: "#5B3FE0",
          tint: "#1F1A35",
        },
        accent: {
          pink: "#FF5C7A",
          orange: "#FFA15C",
          cyan: "#5CB8FF",
          emerald: "#34D399",
          amber: "#FBBF24",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Inter'",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        phone: "0 30px 80px -10px rgba(124, 92, 255, 0.15), 0 8px 24px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
