# Extension Icons

## Quick Solution - Create Simple Icons

You can create basic placeholder icons quickly using any of these methods:

### Method 1: Online Icon Generator
1. Go to https://www.favicon-generator.org/
2. Upload the OpenResume logo from `/public/logo.svg`
3. Download the generated icons
4. Rename them to: `icon-16.png`, `icon-32.png`, `icon-48.png`, `icon-128.png`

### Method 2: Using Paint/Image Editor
1. Create 4 square images with these dimensions:
   - 16x16, 32x32, 48x48, 128x128 pixels
2. Fill with a solid color (e.g., #2563eb - OpenResume blue)
3. Add simple text "OR" in white
4. Save as PNG files with the correct names

### Method 3: Simple Text Icons
Create basic colored squares as temporary placeholders until you have proper icons.

## Required Files
- `icon-16.png` - 16x16 pixels (toolbar icon)
- `icon-32.png` - 32x32 pixels (favicon)  
- `icon-48.png` - 48x48 pixels (extension management)
- `icon-128.png` - 128x128 pixels (Chrome Web Store)

## Current Status
The extension has been configured to work WITHOUT icons for now. You can add icons later by:
1. Creating the 4 PNG files above
2. Uncommenting the icon sections in `manifest.json`
3. Rebuilding the extension 