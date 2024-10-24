const FinishedProduct = require('../models/FinishedProduct');
const { z } = require('zod');

// Zod schema for finished product validation
const finishedProductSchema = z.object({
  product_id: z.number().min(1, "Product ID is required"),
  manufactured_date: z.string().nonempty("Manufactured date is required"),
  manufactured_quantity: z.number().min(1, "Manufactured quantity must be greater than 0"),
  available_quantity: z.number().min(0, "Available quantity must be greater than or equal to 0"),
});

//Create a new Finished Product
exports.createFinishedProduct = async (req, res, next) => {
  try {
    const validatedData = finishedProductSchema.parse(req.body);
    const newFinishedProduct = await FinishedProduct.create(validatedData);
    res.status(201).json(newFinishedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
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
      return res.status(400).json({ errors: error.errors });
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
