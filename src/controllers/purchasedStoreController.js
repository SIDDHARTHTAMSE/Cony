const PurchaseStore = require('../models/purchasedStore');
const { z } = require('zod');

const purchaseStoreSchema = z.object({
  purchase_id: z.number().min(1, "Purchase ID is required"),
  available_quantity: z.number().min(1, "Available quantity must be a non-negative integer"),
});

// Create a new PurchaseStore
exports.createPurchaseStore = async (req, res, next) => {
    try {
      const validatedData = purchaseStoreSchema.parse(req.body);
      const newPurchaseStore = await PurchaseStore.create(validatedData);
      res.status(201).json(newPurchaseStore);
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (process.env.NODE_ENV === 'production') {
          return res.status(400).json({ message: error.errors[0].message });
        }else{
          return res.status(400).json({ errors: error.errors });
        }
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
    const purchaseStore = await PurchaseStore.findByPk(id);

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
    
    const [updated] = await PurchaseStore.update(validatedData, { where: { purchase_store_id: id } });
    
    if (!updated) {
      return res.status(404).json({ message: "PurchaseStore not found or nothing to update" });
    }

    const updatedPurchaseStore = await PurchaseStore.findByPk(id);
    res.status(200).json(updatedPurchaseStore);
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (process.env.NODE_ENV === 'production') {
        return res.status(400).json({ message: error.errors[0].message });
      }else{
        return res.status(400).json({ errors: error.errors });
      }
    }
    next(error);
  }
};

// Delete a PurchaseStore by ID
exports.deletePurchaseStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await PurchaseStore.destroy({ where: { purchase_store_id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "PurchaseStore not found" });
    }

    res.status(200).json({ message: "PurchaseStore deleted successfully" });
  } catch (error) {
    next(error);
  }
};