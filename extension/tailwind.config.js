/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./extension/src/**/*.{ts,tsx,html}"
  ],
  theme: {
    extend: {
      // Remove the dots.svg background image for the extension
      // Extension doesn't need the same background patterns as the main app
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