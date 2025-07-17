// 🎨 AUTOMATICALLY GENERATED - DO NOT EDIT MANUALLY
// To add a new theme:
// 1. Install the theme: npm install jsonresume-theme-[theme-name]
// 2. Run: npm run sync-themes
// 3. The theme will automatically appear in the theme selector!
//
// To regenerate this file: npm run sync-themes
//
import * as crewshinTheme from "jsonresume-theme-crewshin";
import * as evenTheme from "jsonresume-theme-even";
import * as microdataTheme from "jsonresume-theme-microdata";
import * as reactiveTheme from "jsonresume-theme-reactive";

// Registry of available themes (automatically generated)
export const AVAILABLE_THEMES = {
  "crewshin": crewshinTheme,
  "even": evenTheme,
  "microdata": microdataTheme,
  "reactive": reactiveTheme,
} as const;

export type JsonResumeTheme = keyof typeof AVAILABLE_THEMES;