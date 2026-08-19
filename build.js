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

console.log('📁 Copying public folder...');
if (fs.existsSync(publicDir)) {
  copyFolderSync(publicDir, path.join(distDir, 'public'));
}

// Render index.ejs
console.log('📄 Generating index.html...');
const templatePath = path.join(viewsDir, 'index.ejs');

try {
  // Read and render the template
  const template = fs.readFileSync(templatePath, 'utf8');
  
  // Render with EJS
  const html = ejs.render(template, {}, {
    filename: templatePath,
    root: viewsDir
  });

  // Write to dist
  fs.writeFileSync(path.join(distDir, 'index.html'), html);
  
  console.log('✅ Build complete! Files are in the "dist" folder.');
  console.log('📁 You can now deploy the "dist" folder to GitHub Pages.');
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