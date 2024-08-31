import { fontFamily } from "./src/styles/fontFamily"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        'paleta':{
          primaria: "#99BFC6",
          secundaria: "#554348",
          terciaria: "#8C9A9E",
          auxiliar: "#747578",
          fundo: "#E6FFFF",
          construtiva: "#83AB63",
          destrutiva: "#D35252",
        }
      },
      fontFamily
    },
  },
  plugins: [],
}