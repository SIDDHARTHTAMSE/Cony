const { z } = require('zod');
const FinishedProduct = require('../models/FinishedProduct');
const Product = require('../models/Product');
const FinishedStore = require('../models/finishedStore')

// Define Zod schema for finished product validation
const finishedProductSchema = z.object({
  product_id: z.number().positive("Product ID must be a positive integer"),
  manufactured_date: z.string().nonempty("Manufactured date is required")
                      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD"),
  manufactured_quantity: z.number().positive("Manufactured quantity must be greater than 0"),
});

// Create a new Finished Product
exports.createFinishedProduct = async (req, res, next) => {
  const validation = finishedProductSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { product_id, manufactured_date, manufactured_quantity } = req.body;

  try {
    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if entry exists in FinishedStore
    const finishedStoreEntry = await FinishedStore.findOne({ where: { product_id } });

    if (finishedStoreEntry) {
      // Update existing available quantity
      finishedStoreEntry.available_quantity += manufactured_quantity;
      await finishedStoreEntry.save();
    } else {
      // Create a new FinishedStore entry
      await FinishedStore.create({ product_id, available_quantity: manufactured_quantity });
    }

    // Create FinishedProduct record
    const newFinishedProduct = await FinishedProduct.create({
      product_id,
      manufactured_date,
      manufactured_quantity,
    });

    res.status(201).json(newFinishedProduct);

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while creating finished product or updating inventory",
      error: error.message
    });
  }
};

//Get all Finished Products
exports.getAllFinishedProducts = async (req, res, next) => {
  try {
    const finishedProducts = await FinishedProduct.findAll();
    res.status(200).json(finishedProducts);
  } catch (error) {
    next(error);
  }
};

//Get a Finished Product by ID
exports.getFinishedProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const finishedProduct = await FinishedProduct.findByPk(id);

    if (!finishedProduct) {
      return res.status(404).json({ message: "Finished product not found" });
    }

    res.status(200).json(finishedProduct);
  } catch (error) {
    next(error);
  }
};

//Update a Finished Product by ID
exports.updateFinishedProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = finishedProductSchema.parse(req.body);
    
    const [updated] = await FinishedProduct.update(validatedData, { where: { finished_product_id: id } });
    
    if (!updated) {
      return res.status(404).json({ message: "Finished product not found or nothing to update" });
    }

    const updatedFinishedProduct = await FinishedProduct.findByPk(id);
    res.status(200).json(updatedFinishedProduct);
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

//Delete a Finished Product by ID
exports.deleteFinishedProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await FinishedProduct.destroy({ where: { finished_product_id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "Finished product not found" });
    }

    res.status(200).json({ message: "Finished product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
