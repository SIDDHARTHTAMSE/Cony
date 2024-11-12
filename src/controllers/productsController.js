const Product = require('../models/products');
const { z } = require('zod');

const productSchema = z.object({
    product_name: z.string().min(1, "Product name is required"),
});

exports.createProduct = async (req, res, next) => {
    try {
        const validatedData = productSchema.parse(req.body);
        const newProduct = await Product.create(validatedData);
        if (process.env.NODE_ENV === 'Production') {
            const { createdAt, updatedAt, ...productWithoutTimestamps} = newProduct.toJSON();
            return res.status(201).json(productWithoutTimestamps);
        }else{
            return res.status(201).json(newProduct);
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            if (process.env.NODE_ENV === 'Production') {
                return res.status(400).json({ message: error.errors[0].message});
            }else{
                return res.status(400).json({ error: error.errors });
            }
        }
        next(error);
    }
};

exports.getAllProduct = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found"});
        }

        if (process.env.NODE_ENV === 'Production') {
            const { createdAt, updatedAt, ...productData } = product.get();
            return res.status(200).json(productData);
          } else {
            return res.status(200).json(product);
          }
        } catch (error) {
          next(error);
    }
};

exports.updatedProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const validatedData = productSchema.parse(req.body);

        const [updated] = await Product.update(validatedData, { where: { product_id: id} });

        if (!updated) {
            return res.status(404).json({ message: "Product not found or nothing to update"});
        }

        const updatedProduct = await Product.findByPk(id);
        res.status(200).json(updatedProduct);
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

exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Product.destroy({ where: {product_id: id} });

        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully"});
    } catch (error) {
        next(error);
    }
};