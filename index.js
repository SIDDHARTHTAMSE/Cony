require('dotenv').config();
const express = require('express');
const sequelize = require('./src/db'); // Import from db.js
const purchaseRoutes = require('./src/routes/purchaseRoutes');

const app = express();
app.use(express.json());

app.use('/api/v1', purchaseRoutes);

/**
 * Connect to the database and sync models.
 * If the first attempt fails, retry after a delay.
 */
const connectToDatabase = async (retries = 2, delay = 3000) => {
  try {
    console.log('Attempting to connect to the database...');

    // Sync all models with the database (updates tables, no drop)
    await sequelize.sync({ alter: true });
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

// Start the server and connect to the database
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on PORT:${PORT}`);
  await connectToDatabase(); // Connect to the database
});
