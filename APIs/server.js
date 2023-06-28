require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;

// Import your route files
const webRoutes = require('./web/trackergg');
const valShamingBotRoutes = require('./admin/valorantShamingBot');

// Add routes from different files
app.use('/web', webRoutes);
app.use('/admin', valShamingBotRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});