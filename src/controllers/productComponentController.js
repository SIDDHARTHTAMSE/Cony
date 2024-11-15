const ProductComponent = require('../models/productComponents');
const { z } = require('zod');

const ProductComponentSchema = z.object({
    product_id: z.number().min(1, "Product ID is required"),
    component_id: z.number().min(1, "Component ID is required"),
    quantity: z.number().positive("Quantity must be greater than 0"),
});

exports.createProductComponent = async (req, res, next) => {
    try {
        const { product_id, component_id } = req.body;
        if (!product_id) {
            return res.status(400).json({ message: "The product_id is required."})
        }
        if (!component_id) {
            return res.status(400).json({ message: "The component_id is required."})
        }
        const validatedData = ProductComponentSchema.parse(req.body);
        const existingProductComponent = await ProductComponent.findOne({
            where: {
                product_id: validatedData.product_id,
                component_id: validatedData.component_id,
            },
        });

        if (existingProductComponent) {
            return res.status(400).json({
                message: "This component is already added to this product.",
            });
        }

        const newProductComponent = await ProductComponent.create(validatedData);
        return res.status(201).json(newProductComponent);
    } catch (error) {
        if (error instanceof z.ZodError) {
            if (process.env.NODE_ENV === 'production') {
                return res.status(400).json({ message: error.errors[0].message });
            } else {
                return res.status(400).json({ errors: error.errors });
            }
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "This component is already added to this product." });
        }
        
        next(error);
    }
};

exports.getAllProductComponent = async (req, res, next) => {
    try {
        const ProductComponents = await ProductComponent.findAll();
        res.status(200).json(ProductComponents);
    } catch (error) {
        next(error);
    }
};

exports.getProductComponentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ProductComponents = await ProductComponent.findByPk(id);

        if (!ProductComponents) {
            return res.status(404).json( {message: "ProductComponent not found" });
        }

        res.status(200).json(ProductComponents);
    } catch (error) {
        next(error);
    }
};

exports.updateProductComponent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const validatedData = ProductComponentSchema.parse(req.body);

        const [updated] = await ProductComponent.update(validatedData, { where: { product_component_id: id } });

        if (!updated) {
            return res.status(404).json({ message: "ProductComponent not found or nothing to update"});
        }

        const updatedProductComponent = await ProductComponent.findByPk(id);
        res.status(200).json(updatedProductComponent);
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

exports.deleteProductComponent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await ProductComponent.destroy({ where: { product_component_id: id} });

        if (!deleted) {
            return res.status(404).json({ message: "ProductComponent not found"});
        }

        res.status(200).json({ message: "ProductComponent deleted successfully"});
    } catch (error) {
        next(error);
    }
};