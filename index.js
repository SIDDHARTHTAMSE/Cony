require('dotenv').config();
const express = require('express');
const { sequelize } = require('./src/models/inventory'); // Adjust the path if needed
const inventoryRoutes = require('./src/routes/inventory');// Importing inventory routes 
require('dotenv').config(); // Load environment variables from .env file
const { Pool } = require('pg');
const { Sequelize } = require('sequelize'); // Import Sequelize

const app = express();
app.use(express.json());

// Create a new instance of Sequelize using environment variables
const sequelizes = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
});

app.use('/api/v1/inventory', inventoryRoutes);

/**
 * Connect to the database and sync models.
 * If the first attempt fails, retry after a delay.
 */
const connectToDatabase = async (retries = 2, delay = 3000) => {
  try {
    console.log('Attempting to connect to the database...');

    // Sync all models with the database (drops and recreates tables)
    await sequelizes.sync({ force: true });
    console.log('Database connected successfully.');

  } catch (error) {
    console.error('Error connecting to the database:', error);

    if (retries > 0) {
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
      return connectToDatabase(retries - 1, delay); // Recursively try again
    } else {
      console.error('All connection attempts failed. Please check your database configuration.');
    }
  }
};

/**
 * Main function to start the connection process.
 */
const initDatabase = async () => {
  await connectToDatabase(); // Attempt to connect to the database
  await sequelizes.close(); // Close the connection when done
};



// Start the server and connect to the database
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on PORT:${PORT}`);
  await initDatabase(); // Connect to the database
});