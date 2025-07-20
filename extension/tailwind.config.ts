import type { Config } from 'tailwindcss'

import { env } from '../src/app/lib/env';

export default {
  content: [
    "./extension/src/**/*.{ts,tsx,html}"
  ],
  theme: {
    extend: {
      // Fix the dots.svg path for the extension
      // The webpack config copies assets to ./assets/ in the extension dist
      backgroundImage: {
        dot: `url('${env.PUBLIC_URL}/assets/dots.svg')`,
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
} satisfies Config; 