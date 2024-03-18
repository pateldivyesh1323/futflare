/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "norican": ["Norican", "cursive"],
        "basker": ["Baskervville", "serif"],
      },
      colors: {
        "yellow": "#F6E278",
        "icecold": "#BCF4F5",
        "vistablue": "#98DBC6",
        "darkblue": "#00A6A6",
        "marvelous": "#F18D9E",
        "sunflower": "#E6D72A",
        "red": "#d62828"
      }
    },
  },
  plugins: [],
}

