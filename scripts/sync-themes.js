#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getJsonResumeThemes() {
  try {
    // Read package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Get all dependencies
    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    // Filter for jsonresume-theme-* packages
    const themePackages = Object.keys(allDependencies)
      .filter(name => name.startsWith('jsonresume-theme-'))
      .sort(); // Sort for consistent output
    
    return themePackages;
  } catch (error) {
    log(`Error reading package.json: ${error.message}`, 'red');
    process.exit(1);
  }
}

function generateThemesFileContent(themePackages) {
  // Generate import statements
  const imports = themePackages.map(packageName => {
    const themeName = packageName.replace('jsonresume-theme-', '');
    const variableName = `${themeName}Theme`;
    return `import * as ${variableName} from "${packageName}";`;
  }).join('\n');

  // Generate AVAILABLE_THEMES object entries
  const themeEntries = themePackages.map(packageName => {
    const themeName = packageName.replace('jsonresume-theme-', '');
    const variableName = `${themeName}Theme`;
    return `  "${themeName}": ${variableName},`;
  }).join('\n');

  // Generate the complete themes file content
  return `// 🎨 AUTOMATICALLY GENERATED - DO NOT EDIT MANUALLY
// To add a new theme:
// 1. Install the theme: npm install jsonresume-theme-[theme-name]
// 2. Run: npm run sync-themes
// 3. The theme will automatically appear in the theme selector!
//
// To regenerate this file: npm run sync-themes
//
${imports}

// Registry of available themes (automatically generated)
export const AVAILABLE_THEMES = {
${themeEntries}
} as const;

export type JsonResumeTheme = keyof typeof AVAILABLE_THEMES;`;
}

function main() {
  log('🎨 JSON Resume Theme Sync Script', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  // Find JSON Resume theme packages
  log('\n📦 Scanning dependencies for JSON Resume themes...', 'blue');
  const themePackages = getJsonResumeThemes();
  
  if (themePackages.length === 0) {
    log('⚠️  No JSON Resume theme packages found.', 'yellow');
    log('💡 Install themes with: npm install jsonresume-theme-[name]', 'yellow');
    return;
  }
  
  log(`✅ Found ${themePackages.length} theme(s):`, 'green');
  themePackages.forEach(pkg => {
    const themeName = pkg.replace('jsonresume-theme-', '');
    log(`   • ${pkg} → "${themeName}"`, 'green');
  });
  
  // Generate new themes file content
  log('\n🔄 Generating themes file...', 'blue');
  const newContent = generateThemesFileContent(themePackages);
  
  // Write the themes file
  const themesFilePath = path.join(process.cwd(), 'src/app/api/render-theme/themes.ts');
  
  try {
    fs.writeFileSync(themesFilePath, newContent, 'utf8');
    log('✅ Successfully updated src/app/api/render-theme/themes.ts', 'green');
  } catch (error) {
    log(`❌ Error writing themes file: ${error.message}`, 'red');
    process.exit(1);
  }
  
  log('\n🎉 Theme sync completed!', 'green');
  log('💡 Restart your development server to see the changes.', 'yellow');
  
  // Show next steps
  log('\n📋 Summary:', 'cyan');
  log(`   • Themes configured: ${themePackages.length}`, 'cyan');
  log('   • Themes file: src/app/api/render-theme/themes.ts', 'cyan');
  log('   • Route file: unchanged (stable)', 'cyan');
  log('   • Ready to use in theme selector', 'cyan');
  log('   • PDF downloads available for all themes', 'cyan');
}

// Run the script
if (require.main === module) {
  main();
} 