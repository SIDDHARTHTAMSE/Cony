const PurchaseStore = require('../models/purchasedStore');
const Product = require('../models/Product');
const { z } = require('zod');

// Validation schema for PurchaseStore data
const purchaseStoreSchema = z.object({
  product_id: z.number().min(1, "Product ID is required"),
  available_quantity: z.number().min(1, "Available quantity must be a non-negative integer"),
});

// Create a new PurchaseStore
exports.createPurchaseStore = async (req, res, next) => {
  try {
    // Validate request data
    const validatedData = purchaseStoreSchema.parse(req.body);
    
    // Check if the Product exists before creating a PurchaseStore
    const productExists = await Product.findByPk(validatedData.product_id);
    if (!productExists) {
      return res.status(400).json({ message: "Product does not exist" });
    }

    // Create the new PurchaseStore entry
    const newPurchaseStore = await PurchaseStore.create(validatedData);
    res.status(201).json(newPurchaseStore);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: process.env.NODE_ENV === 'production' ? error.errors[0].message : error.errors,
      });
    }
    next(error);
  }
};

// Get all PurchaseStores
exports.getAllPurchaseStores = async (req, res, next) => {
  try {
    const purchaseStores = await PurchaseStore.findAll();
    res.status(200).json(purchaseStores);
  } catch (error) {
    next(error);
  }
};

// Get a PurchaseStore by ID
exports.getPurchaseStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Fetch PurchaseStore along with its associated Product data
    const purchaseStore = await PurchaseStore.findByPk();

    if (!purchaseStore) {
      return res.status(404).json({ message: "PurchaseStore not found" });
    }

    res.status(200).json(purchaseStore);
  } catch (error) {
    next(error);
  }
};

// Update a PurchaseStore by ID
exports.updatePurchaseStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = purchaseStoreSchema.parse(req.body);

    // Check if the PurchaseStore exists
    const purchaseStore = await PurchaseStore.findByPk(id);
    if (!purchaseStore) {
      return res.status(404).json({ message: "PurchaseStore not found" });
    }

    // Update the PurchaseStore entry
    await PurchaseStore.update(validatedData, { where: { id } });
    const updatedPurchaseStore = await PurchaseStore.findByPk(id, {
      include: Product,
    });
    res.status(200).json(updatedPurchaseStore);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: process.env.NODE_ENV === 'production' ? error.errors[0].message : error.errors,
      });
    }
    next(error);
  }
};

// Delete a PurchaseStore by ID
exports.deletePurchaseStore = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Attempt to delete the PurchaseStore
    const deleted = await PurchaseStore.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "PurchaseStore not found" });
    }

    res.status(200).json({ message: "PurchaseStore deleted successfully" });
  } catch (error) {
    next(error);
  }
};
