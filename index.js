require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/db'); 
const categoryRoutes = require('./src/routes/categoryRoutes');
const productRoutes = require('./src/routes/productRoutes');
const purchaseRoutes = require('./src/routes/purchaseRoutes');
const finishedProductRoutes = require('./src/routes/finishedProductRoutes');
const purchasedStoreRoutes = require('./src/routes/purchasedStoreRoutes')
const finishedStoreRoutes = require('./src/routes/finishedStoreRoutes')
const inventoryRoutes = require('./src/routes/inventoryRoutes')
const Product = require('./src/models/Product')
const Category = require('./src/models/Category')
const FinishedProduct = require('./src/models/FinishedProduct')
const PurchaseStore = require('./src/models/purchasedStore')
const FinishedStore = require('./src/models/finishedStore')

// Import Swagger setup
const { swaggerUi, swaggerDocs } = require('./src/config/swagger');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Apply CORS globally

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define routes
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/purchases', purchaseRoutes);
app.use('/api/v1/finished-products', finishedProductRoutes);
app.use('/api/v1/purchase-store', purchasedStoreRoutes);
app.use('/api/v1/finished-stores', finishedStoreRoutes);
app.use('/api/v1/inventory-management', inventoryRoutes);

// Register associations
Product.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Product, { foreignKey: 'category_id' });

FinishedProduct.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(FinishedProduct, { foreignKey: 'product_id' });

FinishedStore.belongsTo(FinishedProduct, { foreignKey: 'finished_product_id' });
FinishedProduct.hasOne(FinishedStore, { foreignKey: 'finished_product_id' });

// Global error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack); // Log stack trace in development
    res.status(err.status || 500).json({ message: err.message, stack: err.stack });
  } else {
    // In production, only send the error message to the client
    res.status(err.status || 500).json({ message: err.message });
  }
});

/**
 * Connect to the database and sync models.
 * If the first attempt fails, retry after a delay.
 */
const connectToDatabase = async (retries = 2, delay = 8080) => {
  try {
    console.log('Attempting to connect to the database...');
    
    // Sync all models with the database (updates tables without dropping)
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
      process.exit(1); // Exit the process with failure
    }
  }
};

// Start the server and connect to the database
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`Server running on PORT: ${PORT}`);
  await connectToDatabase(); // Connect to the database
});

// Export all models for use in other parts of your application
module.exports = {
  Product,
  Category,
  PurchaseStore,
  FinishedProduct,
  FinishedStore,
};
