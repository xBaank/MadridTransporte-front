/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#d4646e",
          50: "#fbeeef",
          100: "#f6d7db",
          200: "#ecb0b7",
          300: "#e28992",
          400: "#d76671",
          500: "#d4646e",
          600: "#b04a55",
          700: "#8a3740",
          800: "#63252c",
          900: "#3d1418",
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
