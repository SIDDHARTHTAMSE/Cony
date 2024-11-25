const { z } = require('zod');
const FinishedProducts = require('../models/finishedProducts');
const Product = require('../models/products');
const FinishedStore = require('../models/finishedStore')

// Define Zod schema for finished component data validation
const finishedProductsSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  manufactured_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD"),
  manufactured_quantity: z.string().min(1, "Manufactured quantity must be a positive number"),
});

// Create a new Finished Products
exports.createFinishedProducts = async (req, res, next) => {
  try {
    // Validate request data
    const validation = finishedProductsSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { product_id, manufactured_date, manufactured_quantity } = req.body;

    // Prepare data for saving
    const dataToSave = {
      product_id: parseInt(product_id, 10),
      manufactured_date,
      manufactured_quantity: parseInt(manufactured_quantity, 10),
    };

    // Check if Component exists
    const productExists = await Product.findByPk(dataToSave.product_id);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create or update the FinishedStore entry
    const finishedStoreEntry = await FinishedStore.findOne({
      where: { product_id: dataToSave.product_id },
    });

    if (finishedStoreEntry) {
      // If the FinishedStore entry exists, update the available_quantity by adding manufactured_quantity
      finishedStoreEntry.available_quantity += dataToSave.manufactured_quantity;
      await finishedStoreEntry.save();
    } else {
      // If no FinishedStore entry exists, create a new one with manufactured_quantity as the available_quantity
      await FinishedStore.create({
        product_id: dataToSave.product_id,
        available_quantity: dataToSave.manufactured_quantity,
      });
    }

    // Create a new FinishedProduct record
    const newFinishedProduct = await FinishedProducts.create(dataToSave);

    res.status(201).json(newFinishedProduct);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      message: "Internal Server Error while creating Finished Products or updating inventory",
      error: error.message,
    });
    next(error);
  }
};

//Get all Finished Products
exports.getAllFinishedProducts = async (req, res, next) => {
  try {
    const finishedProducts = await FinishedProducts.findAll();
    res.status(200).json(finishedProducts);
  } catch (error) {
    next(error);
  }
};

//Get a Finished Product by ID
exports.getFinishedProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const finishedProducts = await FinishedProducts.findByPk(id);

    if (!finishedProducts) {
      return res.status(404).json({ message: "Finished Products not found" });
    }

    res.status(200).json(finishedProducts);
  } catch (error) {
    next(error);
  }
};

//Update a Finished Products by ID
exports.updateFinishedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = finishedProductsSchema.parse(req.body);
    
    const [updated] = await FinishedProducts.update(validatedData, { where: { finished_product_id: id } });
    
    if (!updated) {
      return res.status(404).json({ message: "Finished Products not found or nothing to update" });
    }

    const updatedFinishedProducts = await FinishedProducts.findByPk(id);
    res.status(200).json(updatedFinishedProducts);
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (process.env.NODE_ENV === 'Production') {
        return res.status(400).json({ message: error.errors[0].message });
      }else{
        return res.status(400).json({ errors: error.errors });
      }
    }
    next(error);
  }
};

//Delete a Finished Products by ID
exports.deleteFinishedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await FinishedProducts.destroy({ where: { finished_product_id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "Finished Products not found" });
    }

    res.status(200).json({ message: "Finished Products deleted successfully" });
  } catch (error) {
    next(error);
  }
};
