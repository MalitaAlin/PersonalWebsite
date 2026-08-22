const fs = require('fs');
const path = require('path');

// Set up paths
const viewsDir = path.join(__dirname, 'views');
const distDir = path.join(__dirname, 'dist');

// Ensure dist folder exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Function to read and process a file (remove leading slashes)
function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return '';
  }
  let content = fs.readFileSync(filePath, 'utf8');
  // Remove leading slashes from paths for GitHub Pages compatibility
  content = content.replace(/(href|src)="\//g, '$1="');
  return content;
}

console.log('📄 Building index.html...');

try {
  // Read all partials
  const header = processFile(path.join(viewsDir, 'partials', 'header.ejs'));
  const navigation = processFile(path.join(viewsDir, 'partials', 'navigation.ejs'));
  const footer = processFile(path.join(viewsDir, 'partials', 'footer.ejs'));
  
  // Read all pages
  const home = processFile(path.join(viewsDir, 'pages', 'home.ejs'));
  const code = processFile(path.join(viewsDir, 'pages', 'code.ejs'));
  const art = processFile(path.join(viewsDir, 'pages', 'art.ejs'));
  
  // Read the main template
  let template = fs.readFileSync(path.join(viewsDir, 'index.ejs'), 'utf8');
  
  // Replace includes with actual content
  template = template.replace(/<%- include\s*\(\s*['"](?:partials\/)?header['"]\s*\)\s*%>/g, header);
  template = template.replace(/<%- include\s*\(\s*['"](?:partials\/)?navigation['"]\s*\)\s*%>/g, navigation);
  template = template.replace(/<%- include\s*\(\s*['"](?:partials\/)?footer['"]\s*\)\s*%>/g, footer);
  template = template.replace(/<%- include\s*\(\s*['"](?:pages\/)?home['"]\s*\)\s*%>/g, home);
  template = template.replace(/<%- include\s*\(\s*['"](?:pages\/)?code['"]\s*\)\s*%>/g, code);
  template = template.replace(/<%- include\s*\(\s*['"](?:pages\/)?art['"]\s*\)\s*%>/g, art);
  
  // Remove any remaining EJS tags (just in case)
  template = template.replace(/<%.*?%>/g, '');
  
  // Write to dist
  fs.writeFileSync(path.join(distDir, 'index.html'), template);
  
  // Also copy to root for GitHub Pages
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(__dirname, 'index.html'));
  
  // Copy other static files if they exist
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    console.log('📁 Copying public folder...');
    function copyFolderSync(from, to) {
      if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
      }
      const files = fs.readdirSync(from);
      for (const file of files) {
        const fromPath = path.join(from, file);
        const toPath = path.join(to, file);
        if (fs.statSync(fromPath).isDirectory()) {
          copyFolderSync(fromPath, toPath);
        } else {
          fs.copyFileSync(fromPath, toPath);
        }
      }
    }
    copyFolderSync(publicDir, distDir);
    // Also copy to root for GitHub Pages
    copyFolderSync(publicDir, __dirname);
  }
  
  console.log('✅ Build complete!');
  console.log('📁 Files generated:');
  console.log('   - dist/index.html');
  console.log('   - index.html (root)');
  console.log('   - images/ (folder)');
  console.log('   - css/ (folder)');
  console.log('   - js/ (folder)');
  console.log('📁 You can now deploy to GitHub Pages.');
  
} catch (error) {
  console.error('❌ Error building:', error.message);
  console.error('Make sure your views folder structure is:');
  console.log('  views/');
  console.log('    ├── index.ejs');
  console.log('    ├── partials/');
  console.log('    │   ├── header.ejs');
  console.log('    │   ├── navigation.ejs');
  console.log('    │   └── footer.ejs');
  console.log('    └── pages/');
  console.log('        ├── home.ejs');
  console.log('        ├── code.ejs');
  console.log('        └── art.ejs');
}