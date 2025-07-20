/** @type {import('tailwindcss').Config} */
const { config } = require('dotenv');
config();

module.exports = {
  content: [
    "./extension/src/**/*.{ts,tsx,html}"
  ],
  theme: {
    extend: {
      // Fix the dots.svg path for the extension
      // The webpack config copies assets to ./assets/ in the extension dist
      backgroundImage: {
        dot: `url('${process.env.PUBLIC_URL}/assets/dots.svg')`,
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("@tailwindcss/aspect-ratio"),
  ],
}; 