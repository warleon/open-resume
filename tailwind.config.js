/** @type {import('tailwindcss').Config} */
import { config } from 'dotenv';
config();
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./extension/src/**/*.{ts,tsx,html}"
  ],
  theme: {
    extend: {
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
