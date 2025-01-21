const OrderConfig = require('../models/orderConfig');
const PurchasedStore = require('../models/purchasedStore');
const ProductComponents = require('../models/productComponents');
const { z } = require('zod');

const OrderConfigSchema = z.object({
    product_id: z.string().min(1, "Product ID is required"),
    order_quantity: z.string().nonempty("Order Quantity must be greater than 0"),
  });
  
  // Support both single object and array
  const OrderConfigInputSchema = z.union([
    OrderConfigSchema,               // Single object
    z.array(OrderConfigSchema),      // Array of objects
  ]);
  
  exports.createOrderConfig = async (req, res, next) => {
    try {
      // Validate the input as either a single object or an array
      const validatedInput = OrderConfigInputSchema.parse(req.body);
  
      // Normalize to an array for consistent processing
      const orders = Array.isArray(validatedInput) ? validatedInput : [validatedInput];
  
      // Convert and save each order configuration
      const dataToSave = orders.map((order) => ({
        product_id: parseInt(order.product_id, 10),
        order_quantity: parseInt(order.order_quantity, 10),
        is_confirmed: false,
      }));
  
      // Save all configurations to the database
      const newOrderConfigs = await OrderConfig.bulkCreate(dataToSave);
  
      // Respond with the saved configurations
      res.status(201).json(newOrderConfigs);
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (process.env.NODE_ENV === "Production") {
          return res.status(400).json({ message: error.errors[0].message });
        } else {
          return res.status(400).json({ errors: error.errors });
        }
      }
      next(error);
    }
  };
  

exports.getAllOrderConfig = async (req, res, next) => {
    try {
        const OrderConfigs = await OrderConfig.findAll();
        res.status(200).json(OrderConfigs);
    } catch (error) {
        next(error);
    }
};

exports.getOrderConfigById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const OrderConfigs = await OrderConfig.findByPk(id);

        if (!OrderConfigs) {
            return res.status(404).json({ message: "OrderConfig not found"});
        }

        res.status(200).json(OrderConfigs);
    } catch (error) {
        next(error);
    }
};

exports.updateOrderConfig = async(req, res, next) => {
    try {
        const { id } = req.params;
        const validatedData = OrderConfigSchema.parse(req.body);

        const dataToSave = {
            ...validatedData,
            product_id: validatedData?.product_id
              ? parseInt(validatedData.product_id, 10)
              : null, 
            order_quantity: validatedData?.order_quantity
              ? parseInt(validatedData.order_quantity, 10)
              : null, 
          };


        const [updated] = await OrderConfig.update(validatedData, { where: { order_config_id: id} });

        if (!updated) {
            return res.status(404).json({ message: "OrderConfig not found or nothing to update"})
        }

        const updatedOrderConfig = await OrderConfig.findByPk(id);
        res.status(200).json(updatedOrderConfig);
    } catch(error) {
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

exports.deleteOrderConfig = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await OrderConfig.destroy({ where: { order_config_id: id } });

        if (!deleted) {
            return res.status(404).json({ message: "Order Config not found" });
        }

        res.status(200).json({ message: "Order Config deleted successfully" });
    } catch (error) {
        next(error);
    }
};


exports.confirmOrder = async (req, res, next) => {
  try {
    const { order_config_id } = req.body; // Assuming the order_config_id is sent in the body of the request

    if (!order_config_id) {
      return res.status(400).json({ message: "Order Config ID is required." });
    }

    // Fetch the order_config based on order_config_id
    const orderConfig = await OrderConfig.findOne({
      where: { order_config_id }
    });

    if (!orderConfig) {
      return res.status(404).json({ message: "Order not found." });
    }

    const { product_id, order_quantity } = orderConfig;

    // Fetch the components for the given product_id
    const productComponents = await ProductComponents.findAll({
      where: { product_id }
    });

    if (!productComponents || productComponents.length === 0) {
      return res.status(400).json({ message: "No components found for this product." });
    }

    // Check if the available quantity - component quantity == 0 for each component
    const componentCheckResults = await Promise.all(productComponents.map(async (component) => {
      const { component_id, quantity } = component;

      // Fetch the corresponding purchased component from the store
      const purchaseStore = await PurchasedStore.findOne({
        where: { component_id }
      });

      if (!purchaseStore) {
        return {
          component_id,
          message: `Component with ID ${component_id} is not available in the store.`,
          shortage: null,
          canConfirm: false
        };
      }

      const available_quantity = purchaseStore.available_quantity;

      // Calculate total required quantity
      const totalRequiredQuantity = order_quantity * quantity;

      // Calculate shortage
      const shortage = Math.max(0, totalRequiredQuantity - available_quantity);

      if (shortage > 0) {
        return {
          component_id,
          message: `Component ID ${component_id} is insufficiant quantity. Kindly purchase ${shortage} units to confirm order.`,
          shortage,
          canConfirm: false
        };
      }

      // Deduct available quantity from the PurchaseStore
      purchaseStore.available_quantity -= totalRequiredQuantity;
      await purchaseStore.save();

      return {
        component_id,
        message: `Component ID ${component_id} is available for order.`,
        shortage: 0,
        canConfirm: true
      };
    }));

    // Check if all components are available for confirmation
    const canConfirmOrder = componentCheckResults.every(result => result.canConfirm);

    if (canConfirmOrder) {
      await orderConfig.update({ is_confirmed: true });
      return res.status(200).json({
        message: "The order can be confirmed.",
        order_details: {
          order_config_id,
          product_id,
          order_quantity,
          is_confirmed: true,
          components: componentCheckResults
        }
      });
    } else {
      return res.status(400).json({
        message: "The order cannot be confirmed. Some components are short.",
        order_details: {
          order_config_id,
          product_id,
          order_quantity,
          components: componentCheckResults
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
