/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#5b8db8",
          50: "#eef4f9",
          100: "#d4e4f0",
          200: "#a9c9e1",
          300: "#7badd4",
          400: "#5b8db8",
          500: "#5b8db8",
          600: "#3a6d99",
          700: "#2a5070",
          800: "#1c3749",
          900: "#0f1e28",
        },
        surface: {
          DEFAULT: "#0f1114",
          soft: "#1a1d22",
          card: "#22262d",
          raised: "#2b2f37",
          border: "#323740",
        },
        mode: {
          emt: "#4a7fb8",
          bus: "#5fa677",
          metro: "#5b7a95",
          train: "#5b7a95",
          cercanias: "#8e5fb0",
          bici: "#4fa198",
          tram: "#c9a94e",
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
    },
  },
  plugins: [],
};
