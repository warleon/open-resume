# Scripts Directory

This directory contains utility scripts for the Open Resume project.

## search-jsonresume-themes.js

An interactive utility script to search the npm registry for JSON Resume theme packages and analyze their TypeScript support with pagination and filtering.

### Usage

```bash
# From the project root
npm run search-themes

# Or directly with Node.js
node scripts/search-jsonresume-themes.js
```

### Features

1. **🔍 Comprehensive Search** - Searches npm registry for packages starting with `jsonresume-theme-*`
2. **📊 TypeScript Analysis** - Analyzes TypeScript support by checking for:
   - Type definition files (.d.ts)
   - TypeScript dependencies
   - @types/ packages
   - TypeScript build scripts
   - Type declarations in package.json

3. **🎯 Interactive Menu System** with options to:
   - Browse TypeScript-supported packages (recommended)
   - Browse ALL packages
   - Browse packages WITHOUT TypeScript support
   - Save results to JSON file
   - Exit

4. **📄 Pagination** - Browse packages 5 at a time with navigation controls
5. **🔍 Search Functionality** - Search for specific packages by name or description
6. **💾 Export Results** - Save complete analysis to JSON file

### Interactive Navigation

Once the script starts, you'll see a menu with these options:

```
🎯 JSON Resume Theme Package Explorer
==================================================
📊 Statistics:
   Total packages found: 45
   ✅ With TypeScript support: 12
   ❌ Without TypeScript support: 33
==================================================

Choose an option:
1. 📋 Browse TypeScript-supported packages (recommended)
2. 📋 Browse ALL packages
3. 📋 Browse packages WITHOUT TypeScript support
4. 💾 Save results to JSON file
5. 🚪 Exit
```

### Pagination Controls

When browsing packages, use these commands:
- `n` - Next page
- `p` - Previous page
- `f` - First page
- `l` - Last page
- `s` - Search for specific package
- `m` - Return to main menu

### Package Information Display

Each package shows:
- Package name and version
- Description
- npm URL and repository link
- Last update date
- TypeScript support status with detailed indicators
- Homepage (if different from npm)

### Dependencies

The script uses only Node.js built-in modules:
- `https` - for npm registry API calls
- `fs` - for saving results to file
- `readline` - for interactive user input

No additional npm packages required.

### Example Session

```
🔍 Searching for JSON Resume theme packages...
⏳ This may take a moment as we analyze each package...

📦 Found 45 JSON Resume theme packages
🔍 Analyzing TypeScript support for each package...

⏳ Analyzing package 45/45: jsonresume-theme-stackoverflow
✅ Analysis complete!

🎯 JSON Resume Theme Package Explorer
==================================================
📊 Statistics:
   Total packages found: 45
   ✅ With TypeScript support: 12
   ❌ Without TypeScript support: 33
==================================================

Choose an option:
1. 📋 Browse TypeScript-supported packages (recommended)
2. 📋 Browse ALL packages
3. 📋 Browse packages WITHOUT TypeScript support
4. 💾 Save results to JSON file
5. 🚪 Exit

Enter your choice (1-5): 1

🔍 Browsing: TypeScript-supported packages

📦 Showing packages 1-5 of 12 (Page 1/3)

================================================================================
1. 📦 jsonresume-theme-elegant (v1.2.3)
   📝 A clean and elegant JSON Resume theme
   🔗 https://www.npmjs.com/package/jsonresume-theme-elegant
   📅 Last updated: 12/1/2023
   ✅ TypeScript Support:
      • Has type definitions
      • Uses TypeScript as dependency
   🔗 Repository: https://github.com/mudassir0909/jsonresume-theme-elegant

Navigation:
n - Next page
f - First page
l - Last page
s - Search for specific package
m - Return to main menu

Enter command: 
``` 