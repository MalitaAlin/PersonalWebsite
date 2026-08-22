const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// Set up paths - all relative to root
const viewsDir = path.join(__dirname, 'views');
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

// Ensure dist folder exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy public folder to dist
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

console.log('📁 Copying public folder to dist...');
if (fs.existsSync(publicDir)) {
  copyFolderSync(publicDir, path.join(distDir));
} else {
  console.log('⚠️  No public folder found. Skipping copy.');
}

// Function to read and process template files
function readTemplateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Remove leading slashes from paths for GitHub Pages compatibility
  content = content.replace(/(href|src)="\//g, '$1="');
  return content;
}

// Render index.ejs
console.log('📄 Generating index.html...');
const templatePath = path.join(viewsDir, 'index.ejs');

try {
  // Read and process all partials first
  const partialsDir = path.join(viewsDir, 'partials');
  const pagesDir = path.join(viewsDir, 'pages');
  
  // Read and process each partial
  const header = readTemplateFile(path.join(partialsDir, 'header.ejs'));
  const navigation = readTemplateFile(path.join(partialsDir, 'navigation.ejs'));
  const footer = readTemplateFile(path.join(partialsDir, 'footer.ejs'));
  
  // Read and process each page
  const home = readTemplateFile(path.join(pagesDir, 'home.ejs'));
  const code = readTemplateFile(path.join(pagesDir, 'code.ejs'));
  const art = readTemplateFile(path.join(pagesDir, 'art.ejs'));
  
  // Read the main template
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Replace includes with processed content
  template = template.replace(/<%- include\('partials\/header'\) %>/g, header);
  template = template.replace(/<%- include\('partials\/navigation'\) %>/g, navigation);
  template = template.replace(/<%- include\('partials\/footer'\) %>/g, footer);
  template = template.replace(/<%- include\('pages\/home'\) %>/g, home);
  template = template.replace(/<%- include\('pages\/code'\) %>/g, code);
  template = template.replace(/<%- include\('pages\/art'\) %>/g, art);
  
  // Remove any remaining EJS tags (just in case)
  template = template.replace(/<%.*?%>/g, '');
  
  // Write to dist
  fs.writeFileSync(path.join(distDir, 'index.html'), template);
  
  // Also copy index.html to root for GitHub Pages
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(__dirname, 'index.html'));
  
  console.log('✅ Build complete! Files are in the "dist" folder.');
  console.log('📁 Also copied index.html to root for GitHub Pages.');
  console.log('📁 You can now deploy the entire project to GitHub Pages.');
  console.log('\n📋 Files and folders to deploy:');
  console.log('   - index.html (in root)');
  console.log('   - images/ (folder)');
  console.log('   - css/ (folder)');
  console.log('   - js/ (folder)');
  console.log('   - .nojekyll (file)');
  
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