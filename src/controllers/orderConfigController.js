const OrderConfig = require('../models/orderConfig');
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
    const orders = req.body;

    const processedOrders = orders.map((order) => {
      let canConfirm = true;

      const updatedComponents = order.components.map((component) => {
        const { required_quantity, available_quantity } = component;

        const shortage = Math.max(required_quantity - (available_quantity || 0), 0);

        if (shortage > 0) {
          canConfirm = false;
        }

        return {
          ...component,
          shortage,
        };
      });

      return {
        order_id: order.order_id,
        product_id: order.product_id,
        product_name: order.product_name,
        components: updatedComponents,
        can_confirm: canConfirm,
        message: canConfirm
          ? "You can confirm the order."
          : "Some components have shortages. You cannot confirm the order.",
      };
    });

    res.status(200).json({
      orders: processedOrders,
    });
  } catch (error) {
    next(error);
  }
};
