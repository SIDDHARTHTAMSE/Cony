const FinishedStore = require('../models/finishedStore');
const { z } = require('zod');

const finishedStoreSchema = z.object({
  finished_product_id: z.number().min(1, "Finishe ID is required"),
  available_quantity: z.number().min(1, "Available quantity must be a non-negative integer"),
});

// Create a new FinishedStore
exports.createFinishedStore = async (req, res, next) => {
    try {
      const validatedData = finishedStoreSchema.parse(req.body);
      const newFinishedStore = await FinishedStore.create(validatedData);
      res.status(201).json(newFinishedStore);
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

// Get all FinishedStores
exports.getAllFinishedStores = async (req, res, next) => {
  try {
    const finishedStores = await FinishedStore.findAll();
    res.status(200).json(finishedStores);
  } catch (error) {
    next(error);
  }
};

// Get a PurchaseStore by ID
exports.getFinishedStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const finishedStore = await FinishedStore.findByPk(id);

    if (!finishedStore) {
      return res.status(404).json({ message: "FinishedStore not found" });
    }

    res.status(200).json(finishedStore);
  } catch (error) {
    next(error);
  }
};

// Update a FinishedStore by ID
exports.updateFinishedStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = finishedStoreSchema.parse(req.body);
    
    const [updated] = await FinishedStore.update(validatedData, { where: { finished_store_id: id } });
    
    if (!updated) {
      return res.status(404).json({ message: "FinishedStore not found or nothing to update" });
    }

    const updatedFinishedStore = await FinishedStore.findByPk(id);
    res.status(200).json(updatedFinishedStore);
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

// Delete a FinishedStore by ID
exports.deleteFinishedStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await FinishedStore.destroy({ where: { finished_store_id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "FinishedStore not found" });
    }

    res.status(200).json({ message: "FinishedStore deleted successfully" });
  } catch (error) {
    next(error);
  }
};