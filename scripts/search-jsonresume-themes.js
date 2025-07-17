#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const readline = require('readline');

/**
 * Makes an HTTPS GET request and returns the response as a parsed JSON object
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Failed to parse JSON response: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Creates a readline interface for interactive input
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Prompts user for input with a question
 */
function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

/**
 * Clears the console
 */
function clearConsole() {
  console.clear();
}

/**
 * Displays a paginated list of packages
 */
function displayPaginatedPackages(packages, page = 0, pageSize = 5) {
  const startIndex = page * pageSize;
  const endIndex = Math.min(startIndex + pageSize, packages.length);
  const totalPages = Math.ceil(packages.length / pageSize);
  
  if (packages.length === 0) {
    console.log('❌ No packages found matching the criteria.\n');
    return { hasNext: false, hasPrev: false, totalPages: 0 };
  }
  
  console.log(`\n📦 Showing packages ${startIndex + 1}-${endIndex} of ${packages.length} (Page ${page + 1}/${totalPages})\n`);
  console.log('='.repeat(80));
  
  for (let i = startIndex; i < endIndex; i++) {
    const pkg = packages[i];
    const index = i + 1;
    
    console.log(`${index}. 📦 ${pkg.name} (v${pkg.version})`);
    console.log(`   📝 ${pkg.description}`);
    console.log(`   🔗 ${pkg.npmUrl}`);
    console.log(`   📅 Last updated: ${new Date(pkg.lastModified).toLocaleDateString()}`);
    
    if (pkg.hasTypeScriptSupport.supported) {
      console.log(`   ✅ TypeScript Support:`);
      pkg.typeScriptIndicators.forEach(indicator => {
        console.log(`      • ${indicator}`);
      });
    } else {
      console.log(`   ❌ No TypeScript support detected`);
      if (pkg.error) {
        console.log(`   ⚠️  Error: ${pkg.error}`);
      }
    }
    
    if (pkg.repository) {
      const repoUrl = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository.url;
      if (repoUrl) {
        console.log(`   🔗 Repository: ${repoUrl.replace('git+', '').replace('.git', '')}`);
      }
    }
    
    if (pkg.homepage && pkg.homepage !== pkg.npmUrl) {
      console.log(`   🏠 Homepage: ${pkg.homepage}`);
    }
    
    console.log('');
  }
  
  console.log('='.repeat(80));
  
  return {
    hasNext: page < totalPages - 1,
    hasPrev: page > 0,
    totalPages,
    currentPage: page + 1
  };
}

/**
 * Main interactive menu
 */
async function showMainMenu(rl, allPackages) {
  const withTypeScript = allPackages.filter(pkg => pkg.hasTypeScriptSupport.supported);
  const withoutTypeScript = allPackages.filter(pkg => !pkg.hasTypeScriptSupport.supported);
  
  console.log('\n🎯 JSON Resume Theme Package Explorer');
  console.log('='.repeat(50));
  console.log(`📊 Statistics:`);
  console.log(`   Total packages found: ${allPackages.length}`);
  console.log(`   ✅ With TypeScript support: ${withTypeScript.length}`);
  console.log(`   ❌ Without TypeScript support: ${withoutTypeScript.length}`);
  console.log('='.repeat(50));
  console.log('\nChoose an option:');
  console.log('1. 📋 Browse TypeScript-supported packages (recommended)');
  console.log('2. 📋 Browse ALL packages');
  console.log('3. 📋 Browse packages WITHOUT TypeScript support');
  console.log('4. 💾 Save results to JSON file');
  console.log('5. 🚪 Exit');
  
  const choice = await askQuestion(rl, '\nEnter your choice (1-5): ');
  
  switch (choice.trim()) {
    case '1':
      await browsePackages(rl, withTypeScript, 'TypeScript-supported packages');
      break;
    case '2':
      await browsePackages(rl, allPackages, 'all packages');
      break;
    case '3':
      await browsePackages(rl, withoutTypeScript, 'packages without TypeScript support');
      break;
    case '4':
      saveResultsToFile(allPackages);
      console.log('\n✅ Results saved! Press Enter to return to menu...');
      await askQuestion(rl, '');
      break;
    case '5':
      console.log('\n👋 Goodbye!');
      return false;
    default:
      console.log('\n❌ Invalid choice. Please try again.');
      await askQuestion(rl, 'Press Enter to continue...');
  }
  
  return true;
}

/**
 * Browse packages with pagination
 */
async function browsePackages(rl, packages, title) {
  let currentPage = 0;
  const pageSize = 5;
  
  while (true) {
    clearConsole();
    console.log(`\n🔍 Browsing: ${title}`);
    
    const pagination = displayPaginatedPackages(packages, currentPage, pageSize);
    
    if (packages.length === 0) {
      await askQuestion(rl, 'Press Enter to return to main menu...');
      return;
    }
    
    console.log('\nNavigation:');
    if (pagination.hasPrev) console.log('p - Previous page');
    if (pagination.hasNext) console.log('n - Next page');
    console.log('f - First page');
    console.log('l - Last page');
    console.log('s - Search for specific package');
    console.log('m - Return to main menu');
    
    const input = await askQuestion(rl, '\nEnter command: ');
    
    switch (input.trim().toLowerCase()) {
      case 'n':
        if (pagination.hasNext) currentPage++;
        break;
      case 'p':
        if (pagination.hasPrev) currentPage--;
        break;
      case 'f':
        currentPage = 0;
        break;
      case 'l':
        currentPage = pagination.totalPages - 1;
        break;
      case 's':
        await searchPackages(rl, packages);
        break;
      case 'm':
        return;
      default:
        console.log('\n❌ Invalid command. Press Enter to continue...');
        await askQuestion(rl, '');
    }
  }
}

/**
 * Search for specific packages by name
 */
async function searchPackages(rl, packages) {
  const searchTerm = await askQuestion(rl, '\nEnter package name to search for: ');
  
  if (!searchTerm.trim()) {
    return;
  }
  
  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (filteredPackages.length === 0) {
    console.log(`\n❌ No packages found matching "${searchTerm}"`);
    await askQuestion(rl, 'Press Enter to continue...');
    return;
  }
  
  console.log(`\n🔍 Found ${filteredPackages.length} package(s) matching "${searchTerm}":`);
  displayPaginatedPackages(filteredPackages, 0, filteredPackages.length);
  
  await askQuestion(rl, 'Press Enter to continue...');
}

/**
 * Searches npm registry for packages matching the jsonresume-theme pattern
 */
async function searchJsonResumeThemes() {
  const rl = createReadlineInterface();
  
  try {
    console.log('🔍 Searching for JSON Resume theme packages...');
    console.log('⏳ This may take a moment as we analyze each package...\n');
    
    // Search npm registry for packages starting with jsonresume-theme
    const searchUrl = 'https://registry.npmjs.org/-/v1/search?text=jsonresume-theme&size=250';
    const searchResults = await httpsGet(searchUrl);
    
    if (!searchResults.objects || searchResults.objects.length === 0) {
      console.log('❌ No packages found matching the search criteria.');
      rl.close();
      return;
    }
    
    // Filter packages that start with "jsonresume-theme-"
    const themePackages = searchResults.objects.filter(pkg => 
      pkg.package.name.startsWith('jsonresume-theme-')
    );
    
    console.log(`📦 Found ${themePackages.length} JSON Resume theme packages`);
    console.log('🔍 Analyzing TypeScript support for each package...\n');
    
    // Check each package for TypeScript support with progress indicator
    const packagesWithDetails = [];
    for (let i = 0; i < themePackages.length; i++) {
      const pkg = themePackages[i];
      process.stdout.write(`\r⏳ Analyzing package ${i + 1}/${themePackages.length}: ${pkg.package.name}`);
      
      try {
        const packageInfo = await getPackageDetails(pkg.package.name);
        const hasTypeScriptSupport = checkTypeScriptSupport(packageInfo);
        
        packagesWithDetails.push({
          name: pkg.package.name,
          description: pkg.package.description || 'No description',
          version: pkg.package.version,
          lastModified: pkg.package.date,
          npmUrl: `https://www.npmjs.com/package/${pkg.package.name}`,
          hasTypeScriptSupport,
          typeScriptIndicators: hasTypeScriptSupport.indicators,
          ...packageInfo
        });
      } catch (error) {
        packagesWithDetails.push({
          name: pkg.package.name,
          description: pkg.package.description || 'No description',
          version: pkg.package.version,
          lastModified: pkg.package.date,
          npmUrl: `https://www.npmjs.com/package/${pkg.package.name}`,
          hasTypeScriptSupport: { supported: false, indicators: ['Failed to fetch details'] },
          error: error.message
        });
      }
    }
    
    console.log('\n✅ Analysis complete!\n');
    
    // Start interactive menu
    let continueMenu = true;
    while (continueMenu) {
      clearConsole();
      continueMenu = await showMainMenu(rl, packagesWithDetails);
    }
    
  } catch (error) {
    console.error('❌ Error searching for packages:', error.message);
  } finally {
    rl.close();
  }
}

/**
 * Gets detailed package information from npm registry
 */
async function getPackageDetails(packageName) {
  const packageUrl = `https://registry.npmjs.org/${packageName}`;
  const packageData = await httpsGet(packageUrl);
  
  const latestVersion = packageData['dist-tags']?.latest;
  const versionData = packageData.versions?.[latestVersion];
  
  return {
    dependencies: versionData?.dependencies || {},
    devDependencies: versionData?.devDependencies || {},
    peerDependencies: versionData?.peerDependencies || {},
    files: versionData?.files || [],
    main: versionData?.main,
    types: versionData?.types,
    typings: versionData?.typings,
    scripts: versionData?.scripts || {},
    keywords: versionData?.keywords || [],
    repository: versionData?.repository,
    homepage: versionData?.homepage,
    bugs: versionData?.bugs,
    author: versionData?.author,
    license: versionData?.license,
    engines: versionData?.engines
  };
}

/**
 * Checks if a package has TypeScript support (strict check - only type definitions)
 */
function checkTypeScriptSupport(packageInfo) {
  const indicators = [];
  let supported = false;
  
  // Check for TypeScript type definitions in package.json
  if (packageInfo.types || packageInfo.typings) {
    indicators.push(`Has type definitions: ${packageInfo.types || packageInfo.typings}`);
    supported = true;
  }
  
  // Check for .d.ts files in file list
  const dtsFiles = packageInfo.files.filter(file => file.endsWith('.d.ts'));
  if (dtsFiles.length > 0) {
    indicators.push(`Contains .d.ts files: ${dtsFiles.join(', ')}`);
    supported = true;
  }
  
  // Check main entry point for .d.ts
  if (packageInfo.main && packageInfo.main.endsWith('.d.ts')) {
    indicators.push('Main entry point is a .d.ts file');
    supported = true;
  }
  
  // Additional context indicators (for information only, don't affect support status)
  const contextIndicators = [];
  
  // Check for TypeScript in dependencies (context only)
  if (packageInfo.dependencies?.typescript || packageInfo.devDependencies?.typescript) {
    contextIndicators.push('Uses TypeScript as dependency');
  }
  
  // Check for @types/ dependencies (context only)
  const typeDeps = Object.keys({...packageInfo.dependencies, ...packageInfo.devDependencies})
    .filter(dep => dep.startsWith('@types/'));
  
  if (typeDeps.length > 0) {
    contextIndicators.push(`Has @types dependencies: ${typeDeps.join(', ')}`);
  }
  
  // Check for TypeScript-related scripts (context only)
  const tsScripts = Object.keys(packageInfo.scripts)
    .filter(script => packageInfo.scripts[script].includes('tsc') || packageInfo.scripts[script].includes('typescript'));
  
  if (tsScripts.length > 0) {
    contextIndicators.push(`Has TypeScript scripts: ${tsScripts.join(', ')}`);
  }
  
  // Add context indicators if package has type definitions
  if (supported && contextIndicators.length > 0) {
    indicators.push(...contextIndicators.map(indicator => `[Context] ${indicator}`));
  }
  
  if (!supported) {
    if (contextIndicators.length > 0) {
      indicators.push('No type definitions found, but has TypeScript-related dependencies/scripts');
      indicators.push(...contextIndicators.map(indicator => `[Context] ${indicator}`));
    } else {
      indicators.push('No type definitions or TypeScript indicators found');
    }
  }
  
  return { supported, indicators };
}



/**
 * Save results to a JSON file for further analysis
 */
function saveResultsToFile(packages) {
  const results = {
    searchDate: new Date().toISOString(),
    totalPackages: packages.length,
    withTypeScriptSupport: packages.filter(pkg => pkg.hasTypeScriptSupport.supported).length,
    withoutTypeScriptSupport: packages.filter(pkg => !pkg.hasTypeScriptSupport.supported).length,
    packages
  };
  
  const filename = 'jsonresume-themes-analysis.json';
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  console.log(`💾 Results saved to ${filename}`);
}

// Run the script
if (require.main === module) {
  searchJsonResumeThemes().catch(console.error);
}

module.exports = { searchJsonResumeThemes, checkTypeScriptSupport }; 