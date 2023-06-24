require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;
const DatabaseHandler = require('../Core/DatabaseHandler');

// Import your route files
const webRoutes = require('./web/trackergg');

// Add routes from different files
app.use('/web', webRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});