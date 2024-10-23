//const { Product } = require('../models/inventory');

// Create a new item
const createItem = async (req, res) => {
  try {
    //const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all items
const getAllItems = async (req, res) => {
  try {
    //const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createItem, getAllItems };
