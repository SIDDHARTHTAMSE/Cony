const PurchaseStore = require('../models/purchasedStore');
const Component = require('../models/component');
const { z } = require('zod');

const purchaseStoreSchema = z.object({
  component_id: z.string().min(1, "Component ID is required"),
  available_quantity: z.string().min(1, "Available quantity must be a non-negative integer"),
});

// Create a new PurchaseStore
exports.createPurchaseStore = async (req, res, next) => {
  try {
    const validatedData = purchaseStoreSchema.parse(req.body);

    const dataToSave = {
      ...validatedData,
      component_id: validatedData?.component_id
        ? parseInt(validatedData.component_id, 10)
        : null,
      available_quantity: validatedData?.available_quantity
        ? parseInt(validatedData.available_quantity, 10)
        : null,
    };

    const ComponentExists = await Component.findByPk(validatedData.component_id);
    if (!ComponentExists) {
      return res.status(400).json({ message: "Component does not exist" });
    }

    const existingPurchaseStore = await PurchaseStore.findOne({
      where: { component_id: validatedData.component_id },
    });

    if (existingPurchaseStore) {
      return res.status(400).json({ message: "component_id already exists in PurchaseStore" });
    }

    const newPurchaseStore = await PurchaseStore.create(validatedData);
    return res.status(201).json(newPurchaseStore);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: process.env.NODE_ENV === 'Production' ? error.errors[0].message : error.errors,
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

// Get a Purchase Store By ID
exports.getPurchaseStoreById = async (req, res, next) => {
  try {
    const { purchase_store_id } = req.params;

    if (!purchase_store_id) {
      return res.status(400).json({ message: "purchase_store_id parameter is missing" });
    }

    const purchaseStore = await PurchaseStore.findByPk(purchase_store_id);

    if (!purchaseStore) {
      return res.status(404).json({ message: "PurchaseStore not found" });
    }

    res.status(200).json(purchaseStore);
  } catch (error) {
    console.error("Error fetching PurchaseStore by ID:", error);
    next(error);
  }
};

// Update PurchaseStore by ID
exports.updatePurchaseStoreById = async (req, res, next) => {
  try {
    const { purchase_store_id } = req.params;
    const validatedData = purchaseStoreSchema.parse(req.body);

    const dataToSave = {
      ...validatedData,
      component_id: validatedData?.component_id
        ? parseInt(validatedData.component_id, 10)
        : null, 
      available_quantity: validatedData?.available_quantity
        ? parseInt(validatedData.available_quantity, 10)
        : null, 
    };

    const purchaseStore = await PurchaseStore.findByPk(purchase_store_id);
    if (!purchaseStore) {
      return res.status(404).json({ message: "PurchaseStore not found" });
    }

    await PurchaseStore.update(validatedData, { where: { purchase_store_id } });
    const updatedPurchaseStore = await PurchaseStore.findByPk(purchase_store_id);
    res.status(200).json(updatedPurchaseStore);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: process.env.NODE_ENV === 'Production' ? error.errors[0].message : error.errors,
      });
    }
    next(error);
  }
};

// Delete PurchaseStore by ID
exports.deletePurchaseStoreById = async (req, res, next) => {
  try {
    const { purchase_store_id } = req.params;
    const deleted = await PurchaseStore.destroy({ where: { purchase_store_id } });

    if (!deleted) {
      return res.status(404).json({ message: "PurchaseStore not found" });
    }

    res.status(200).json({ message: "PurchaseStore deleted successfully" });
  } catch (error) {
    next(error);
  }
};
