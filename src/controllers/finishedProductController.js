const { z } = require('zod');
const { Op } = require("sequelize");
const FinishedProducts = require('../models/finishedProducts');
const Product = require('../models/products');
const FinishedStore = require('../models/finishedStore')
const ProductComponents = require('../models/productComponents');
const PurchaseStore = require('../models/purchasedStore');
const SubComponentStore = require('../models/subComponentStore');

const finishedProductsSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  manufactured_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD"),
  manufactured_quantity: z.string().min(1, "Manufactured quantity must be a positive number"),
});

// Create a new Finished Products
exports.createFinishedProducts = async (req, res, next) => {
  try {
    const validation = finishedProductsSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { product_id, manufactured_date, manufactured_quantity } = req.body;
    const manufacturedQty = parseInt(manufactured_quantity, 10);

    // Validate Product
    const productExists = await Product.findByPk(product_id);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch required components and subcomponents for this product
    const productComponents = await ProductComponents.findAll({
      where: { product_id },
    });

    if (!productComponents.length) {
      return res.status(400).json({ message: "No components/subcomponents linked to this product" });
    }

    // Check and reduce required quantity from store
    for (const pc of productComponents) {
      const requiredQty = pc.quantity * manufacturedQty; // Total required for manufacturing

      if (pc.component_id) {
        // Handle Components
        const componentStore = await PurchaseStore.findOne({
          where: { component_id: pc.component_id },
        });

        if (!componentStore || componentStore.available_quantity < requiredQty) {
          return res.status(400).json({
            message: `Not enough quantity in store for component_id: ${pc.component_id}`,
          });
        }

        // Deduct the quantity
        componentStore.available_quantity -= requiredQty;
        await componentStore.save();
      }

      if (pc.subcomponents_id) {
        // Handle Subcomponents
        const subComponentStore = await SubComponentStore.findOne({
          where: { subcomponents_id: pc.subcomponents_id },
        });

        if (!subComponentStore || subComponentStore.quantity < requiredQty) {
          return res.status(400).json({
            message: `Not enough quantity in store for subcomponents_id: ${pc.subcomponents_id}`,
          });
        }

        // Deduct the quantity
        subComponentStore.quantity -= requiredQty;
        await subComponentStore.save();
      }
    }

    // Add product to FinishedStore
    const finishedStoreEntry = await FinishedStore.findOne({ where: { product_id } });

    if (finishedStoreEntry) {
      finishedStoreEntry.available_quantity += manufacturedQty;
      await finishedStoreEntry.save();
    } else {
      await FinishedStore.create({
        product_id,
        available_quantity: manufacturedQty,
      });
    }

    // Create a new entry in FinishedProducts
    const newFinishedProduct = await FinishedProducts.create({
      product_id,
      manufactured_date,
      manufactured_quantity: manufacturedQty,
    });

    res.status(201).json({ message: "Finished product created successfully", data: newFinishedProduct });
  } catch (error) {
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
