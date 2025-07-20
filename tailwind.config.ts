import type { Config } from 'tailwindcss'

import { env } from './src/app/lib/env';

export default {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./extension/src/**/*.{ts,tsx,html}"
  ],
  theme: {
    extend: {
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
