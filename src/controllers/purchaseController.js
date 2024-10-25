const { z } = require('zod'); // Import Zod for validation
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

// Define Zod schema for purchase data validation
const purchaseSchema = z.object({
  purchase_date: z.string().nonempty("Purchase date is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD"),
  purchased_quantity: z.number().positive("Purchased quantity must be a positive number"),
  product_id: z.number().positive("Product ID must be a positive integer"),
});

// Create a purchase
exports.createPurchase = async (req, res) => {
  // Validate the request body
  const validation = purchaseSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { purchase_date, purchased_quantity, product_id } = req.body;
  try {
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newPurchase = await Purchase.create({
      purchase_date,
      purchased_quantity,
      product_id,
    });

    res.status(201).json(newPurchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all purchases
exports.getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({ include: Product });
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single purchase
exports.getPurchaseById = async (req, res) => {
  const { id } = req.params;
  try {
    const purchase = await Purchase.findByPk(id, { include: Product });
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a purchase
exports.updatePurchase = async (req, res) => {
  const { id } = req.params;
  
  // Validate the request body
  const validation = purchaseSchema.partial().safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { purchase_date, purchased_quantity } = req.body;
  try {
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    purchase.purchase_date = purchase_date || purchase.purchase_date;
    purchase.purchased_quantity = purchased_quantity || purchase.purchased_quantity;
    await purchase.save();

    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a purchase
exports.deletePurchase = async (req, res) => {
  const { id } = req.params;
  try {
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    await purchase.destroy();
    res.status(200).json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
