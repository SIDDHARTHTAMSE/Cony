const Category = require('../models/Category');
const { z } = require('zod');

// Zod schema for validating category data
const categorySchema = z.object({
  category_name: z.string().min(1, "Category name is required"),
});

//Create a new Category
exports.createCategory = async (req, res, next) => {
  try {
    const validatedData = categorySchema.parse(req.body);
    const newCategory = await Category.create(validatedData);
    res.status(201).json(newCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);  // Pass the error to the global error handler
  }
};

//Get all Categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

//Get a Category by ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

//Update a Category by ID
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = categorySchema.parse(req.body);
    
    const [updated] = await Category.update(validatedData, { where: { category_id: id } });
    
    if (!updated) {
      return res.status(404).json({ message: "Category not found or nothing to update" });
    }

    const updatedCategory = await Category.findByPk(id);
    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

// Delete a Category by ID
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { category_id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
