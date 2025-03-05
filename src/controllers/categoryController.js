const { Op } = require('sequelize');
const Category = require('../models/category');
const { z } = require('zod');

const categorySchema = z.object({
  category_name: z.string().min(1, "Category name is required"),
});

//Create a new Category
exports.createCategory = async (req, res, next) => {
  try {

    const validatedData = categorySchema.parse(req.body);

    const newCategory = await Category.create(validatedData);

    if (process.env.NODE_ENV === 'Production') {
      const { createdAt, updatedAt, ...categoryWithoutTimestamps } = newCategory.toJSON();
      return res.status(201).json({
        category_id: categoryWithoutTimestamps.category_id,
        category_name: categoryWithoutTimestamps.category_name
      });
    }else{
      return res.status(201).json(newCategory);
    }
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

    if (process.env.NODE_ENV === 'Production') {
      const { createdAt, updatedAt, ...categoryData } = category.get();
      return res.status(200).json(categoryData);
    } else {
      return res.status(200).json(category);
    }
  } catch (error) {
    next(error);
  }
};

// Get a Category by name
exports.getCategoryByName = async(req, res, next) => {
  try{
    const { category_name } = req.body;

    if (!category_name){
      return res.status(404).json({ message: "Category name is required"});
    }

    const existingCategory = await Category.findOne({
      where: { category_name },
    });

    if(!existingCategory){
      return res.status(404).json({ message: "Category name is not found"});
    }

    if(process.env.NODE_ENV === 'Production') {
      const { createdAt, updatedAt, ...categoryData} = existingCategory.get();
      return res.status(200).json(categoryData);
    } else {
      return res.status(200).json(existingCategory);
    }
  } catch (error){
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
      if (process.env.NODE_ENV === 'Production') {
        return res.status(400).json({ message: error.errors[0].message });
      }else{
        return res.status(400).json({ errors: error.errors });
      }
    }
    next(error);
  }
};

// Delete a Category by ID
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Category.destroy({ 
      where: { category_id: id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Soft Delete a Category by ID
exports.softDeleteCategory = async (req, res, next) => {
  try{
    const { id } = req.params;

    const existingCategory = await Category.findOne({ where: { category_id: id } });

    if(! existingCategory){
      return res.status(404).json({ message: "Category not found" });
    }

    const deleteAt = new Date();
    await existingCategory.update({ is_deleted: true, deleted_at: deleteAt});
    
    res.status(200).json({
      deleteAt: existingCategory.deleted_at,
      is_deleted: existingCategory.is_deleted
    });
  } catch(error){
    next (error);
  }
};

// Restore Soft Delete Category by ID 
exports.restoreCategory = async (req, res, next) => {
  try{
    const { id } = req.params;

    const existingCategory = await Category.findOne({ 
      where: { 
        category_id: id,
        deleted_at: { [Op.ne]: null},
        is_deleted: true 
      }, 
    });

    if(!existingCategory) {
      return res.status(404).json({ message: "Category not found or not deleted"});
    }

    existingCategory.is_deleted = false;
    existingCategory.deleted_at = null;
    await existingCategory.save();

    res.status(200).json({ message: "Category restored successfully"});
  } catch(error){
    next(error);
  }
};