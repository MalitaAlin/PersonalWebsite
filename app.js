const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set up EJS - THIS IS THE CRITICAL PART
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index');  // This looks for views/index.ejs
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Views directory: ${path.join(__dirname, 'views')}`);
});