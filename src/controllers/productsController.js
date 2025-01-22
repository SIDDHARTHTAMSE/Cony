const Product = require('../models/products');
const { z } = require('zod');

const productSchema = z.object({
    product_name: z.string().min(1, "Product name is required"),
});

// Create a new Product
exports.createProduct = async (req, res, next) => {
    try {
        const { product_name } = req.body;
        if (!product_name) {
            return res.status(400).json({ message: "The product_name is required."})
        }
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

// Get All Products
exports.getAllProduct = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

// Get a Product By ID
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

// Get a Product By Name
exports.getProductByName = async (req, res, next) => {
    try{
        const { product_name } = req.body;

        if(!product_name) {
            return res.status(404).json({ message: " Product name is required"});
        }

        const existingProducts = await Product.findOne({
            where: { product_name },
        });

        if(!existingProducts){
            return res.status(404).json({ message: " Product is not found"});
        }

        if(process.env.NODE_ENV === 'Production') {
            const { createdAt, updatedAt, ...categoryData} = existingProducts.get();
            return res.status(200).json(categoryData);
        } else {
            return res.status(200).json(existingProducts);
        }
    } catch (error){
        next(error);
    }
};

// Update a Product By ID
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

// Delete a Product By ID
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