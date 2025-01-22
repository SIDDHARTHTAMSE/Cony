const ProductComponent = require('../models/productComponents');
const { z } = require('zod');

const ProductComponentSchema = z.object({
    product_id: z.string().nullable().optional(),
    component_id: z.string().min(1, "Component ID is required"),
    quantity: z.string().nonempty("Quantity must be greater than 0"),
  });

// Create a new Product Components
  exports.createProductComponents = async (req, res, next) => {
    try {
      const payload = req.body;
  
      if (!Array.isArray(payload)) {
        return res.status(400).json({ message: "Payload must be an array of components." });
      }
  
      const validationErrors = [];
      const validComponents = [];
  
      for (const component of payload) {
        try {
          const validatedData = ProductComponentSchema.parse(component);
  
          const existingComponent = await ProductComponent.findOne({
            where: { 
              component_id: validatedData.component_id,
              product_id: validatedData.product_id,
             },
          });
  
          if (existingComponent) {
            validationErrors.push({
              component_id: validatedData.component_id,
              product_id: validatedData.product_id,
              message: `Component ID '${validatedData.component_id}' already exists for Product ID '${validatedData.product_id}'.`,
            });
          } else {
            validComponents.push({
              product_id: validatedData.product_id ? parseInt(validatedData.product_id, 10) : null,
              component_id: validatedData.component_id ? parseInt(validatedData.component_id, 10) : null,
              quantity: validatedData.quantity ? parseInt(validatedData.quantity, 10) : null,
            });
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            validationErrors.push({
              component_id: component.component_id || null,
              message: error.errors[0].message,
            });
          }
        }
      }
  
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }
  
      const createdComponents = await ProductComponent.bulkCreate(validComponents);
      return res.status(201).json(createdComponents);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: "Component ID already exists in the database." });
      }
      next(error);
    }
  };

// Get a All Product Components
exports.getAllProductComponent = async (req, res, next) => {
    try {
        const ProductComponents = await ProductComponent.findAll();
        res.status(200).json(ProductComponents);
    } catch (error) {
        next(error);
    }
};

// Get a Product Components By ID
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

// Update a Product Components By ID
exports.updateProductComponent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const validatedData = ProductComponentSchema.parse(req.body);

        const dataToSave = {
            ...validatedData,
            product_id: validatedData?.product_id
              ? parseInt(validatedData.product_id, 10)
              : null, 
            component_id: validatedData?.component_id
              ? parseInt(validatedData.component_id, 10)
              : null, 
            quantity: validatedData?.quantity
              ? parseInt(validatedData.quantity, 10)
              : null, 
          };

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

// Delete a Product Component By ID
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