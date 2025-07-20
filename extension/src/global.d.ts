// Global type definitions for the extension

/// <reference types="chrome" />
/// <reference types="webextension-polyfill" />

declare global {
  interface Window {
    openResumeExtensionLoaded?: boolean;
  }
}

export {}; 