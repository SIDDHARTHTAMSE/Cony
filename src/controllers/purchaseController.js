const { z } = require('zod'); // Import Zod for validation
const Purchase = require('../models/purchase');
const Component = require('../models/component');
const PurchaseStore = require('../models/purchasedStore');

// Define Zod schema for purchase data validation
const purchaseSchema = z.object({
  purchase_date: z.string().nonempty("Purchase date is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD"),
  purchased_quantity: z.number().positive("Purchased quantity must be a positive number"),
  component_id: z.number().positive("Component ID must be a positive integer"),
});

// Create a new Purchase
exports.createPurchase = async (req, res, next) => {
  const validation = purchaseSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { purchase_date, purchased_quantity, component_id } = req.body;

  try {
    // Check if Component exists
    const Components = await Component.findByPk(component_id);
    if (!Components) {
      return res.status(404).json({ message: 'Component not found' });
    }

    // Find or update PurchaseStore entry
    const purchaseStoreEntry = await PurchaseStore.findOne({ where: { component_id } });
    if (purchaseStoreEntry) {
      purchaseStoreEntry.available_quantity += purchased_quantity;
      await purchaseStoreEntry.save();
    } else {
      await PurchaseStore.create({ component_id, available_quantity: purchased_quantity });
    }

    // Create a new purchase record
    const newPurchase = await Purchase.create({ purchase_date, purchased_quantity, component_id });
    res.status(201).json(newPurchase);

  } catch (error) {
    next(error);
  }
};

// Get all purchases
exports.getPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.findAll();
    res.status(200).json(purchases);
  } catch (error) {
    next(error);
  }
};

// Get a single purchase by ID
exports.getPurchaseById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.status(200).json(purchase);
  } catch (error) {
    next(error);
  }
};

// Update a purchase by ID
exports.updatePurchase = async (req, res, next) => {
  const { id } = req.params;
  
  // Validate request body with partial schema
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

    // Update fields if provided
    purchase.purchase_date = purchase_date || purchase.purchase_date;
    purchase.purchased_quantity = purchased_quantity || purchase.purchased_quantity;
    await purchase.save();

    res.status(200).json(purchase);
  } catch (error) {
    next(error);
  }
};

// Delete a purchase by ID
exports.deletePurchase = async (req, res, next) => {
  const { id } = req.params;
  try {
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    await purchase.destroy();
    res.status(200).json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    next(error);
  }
};
