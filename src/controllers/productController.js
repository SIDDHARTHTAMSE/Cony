const Product = require('../models/Product');
const { z } = require('zod');

// Zod schema for product validation
const productSchema = z.object({
  category_id: z.number().min(1, "Category ID is required"),
  product_name: z.string().nonempty("Product name is required"),
});

//Create a new Product
exports.createProduct = async (req, res, next) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const newProduct = await Product.create(validatedData);
    res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

//Get all Products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

//Get a Product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

//Update a Product by ID
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = productSchema.parse(req.body);
    
    const [updated] = await Product.update(validatedData, { where: { product_id: id } });
    
    if (!updated) {
      return res.status(404).json({ message: "Product not found or nothing to update" });
    }

    const updatedProduct = await Product.findByPk(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

//Delete a Product by ID
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { product_id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
