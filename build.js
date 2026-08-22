const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const distDir = path.join(__dirname, 'dist');

// Create dist folder
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Render with EJS
ejs.renderFile(
  path.join(viewsDir, 'index.ejs'),
  {},
  { root: viewsDir },
  (err, html) => {
    if (err) {
      console.error('❌ Error:', err);
      return;
    }
    
    // Remove leading slashes for GitHub Pages
    html = html.replace(/(href|src)="\//g, '$1="');
    
    // Write to dist
    fs.writeFileSync(path.join(distDir, 'index.html'), html);
    fs.writeFileSync(path.join(__dirname, 'index.html'), html);
    
    console.log('✅ Build complete!');
  }
);