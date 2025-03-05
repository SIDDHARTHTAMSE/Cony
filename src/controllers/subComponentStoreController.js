const { Op } = require("sequelize");
const SubComponentStore = require("../models/subComponentStore");
const SubComponent = require('../models/subComponents');
const PurchaseStore = require('../models/purchasedStore');
const { z } = require("zod");

const subComponentStoreSchema = z.object({
  subcomponents_id: z.string().min(1, "SubComponent ID is required"),
  quantity: z.string().min(1, "Quantity must be greater than 0"),
});

// Create a new SubComponentStore
exports.createSubComponentStore = async (req, res, next) => {
  try {
    const validatedData = subComponentStoreSchema.parse(req.body);

    const existingSubComponent = await SubComponent.findOne({
      where: { subcomponents_id: validatedData.subcomponents_id },
    });

    if (!existingSubComponent) {
      return res.status(404).json({ message: "SubComponent ID not found" });
    }

    const parentComponentId = existingSubComponent.component_id;
    if (!parentComponentId) {
      return res.status(400).json({ message: "Parent Component ID not found for this SubComponent" });
    }

    const purchaseStoreEntry = await PurchaseStore.findOne({
      where: { component_id: parentComponentId },
    });

    if (!purchaseStoreEntry || purchaseStoreEntry.available_quantity < parseInt(validatedData.quantity, 10)) {
      return res.status(400).json({ message: "Insufficient stock in Purchase Store" });
    }

    await PurchaseStore.update(
      { available_quantity: purchaseStoreEntry.available_quantity - parseInt(validatedData.quantity, 10) },
      { where: { component_id: parentComponentId } }
    );

    const newSubComponentStore = await SubComponentStore.create(validatedData);
    return res.status(201).json(newSubComponentStore);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

// Get all SubComponentStores
exports.getAllSubComponentStores = async (req, res, next) => {
  try {
    const subComponentStores = await SubComponentStore.findAll();
    res.status(200).json(subComponentStores);
  } catch (error) {
    next(error);
  }
};

// Get a SubComponentStore by ID
exports.getSubComponentStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subComponentStore = await SubComponentStore.findByPk(id);

    if (!subComponentStore) {
      return res.status(404).json({ message: "SubComponentStore not found" });
    }
    res.status(200).json(subComponentStore);
  } catch (error) {
    next(error);
  }
};

// Update a SubComponentStore by ID
exports.updateSubComponentStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = subComponentStoreSchema.parse(req.body);

    const [updated] = await SubComponentStore.update(validatedData, { where: { subcomponentstore_id: id } });

    if (!updated) {
      return res.status(404).json({ message: "SubComponentStore not found or nothing to update" });
    }

    const updatedSubComponentStore = await SubComponentStore.findByPk(id);
    res.status(200).json(updatedSubComponentStore);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

// Delete a SubComponentStore by ID
exports.deleteSubComponentStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await SubComponentStore.destroy({ where: { subcomponentstore_id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "SubComponentStore not found" });
    }

    res.status(200).json({ message: "SubComponentStore deleted successfully" });
  } catch (error) {
    next(error);
  }
};
