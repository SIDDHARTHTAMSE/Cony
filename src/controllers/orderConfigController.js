const OrderConfig = require('../models/orderConfig');
const PurchasedStore = require('../models/purchasedStore');
const ProductComponents = require('../models/productComponents');
const FinishedStore = require('../models/finishedStore');
const { z } = require('zod');

const OrderConfigSchema = z.object({
    product_id: z.string().min(1, "Product ID is required"),
    order_quantity: z.string().nonempty("Order Quantity must be greater than 0"),
  });

  const updatePrioritySchema = z.object({
    order_id: z.string().min(1, "Order ID is required"),
  });
  
  const OrderConfigInputSchema = z.union([
    OrderConfigSchema,               
    z.array(OrderConfigSchema),
  ]);

// Create a new OrderConfig
exports.createOrderConfig = async (req, res, next) => {
  try {
    const validatedInput = OrderConfigInputSchema.parse(req.body);

    const newOrder = await OrderConfig.create(validatedInput);
    const orderData = newOrder.toJSON();

    if (process.env.NODE_ENV === 'Production') {
      return res.status(201).json({
        order_config_id: orderData.order_config_id,
        product_id: orderData.product_id,
        order_quantity: orderData.order_quantity,
        createdAt: orderData.createdAt.toISOString().split("T")[0],
      });
    }else{
      return res.status(201).json(orderData);
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

// API to manually set order as priority
exports.setOrderPriority = async (req, res, next) => {
  try {
    // Validate request
    const validatedData = updatePrioritySchema.parse(req.body);
    const priorityOrderId = parseInt(validatedData.order_id, 10);

    // Find priority order
    const priorityOrder = await OrderConfig.findByPk(priorityOrderId);
    if (!priorityOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get available stock
    let finishedStore = await FinishedStore.findOne({
      where: { product_id: priorityOrder.product_id },
    });

    if (!finishedStore) {
      return res.status(400).json({ message: "No finished store entry found" });
    }

    let availableQuantity = finishedStore.available_quantity;

    // Fetch all orders (sorted FIFO) for reallocation
    let allOrders = await OrderConfig.findAll({
      where: { product_id: priorityOrder.product_id },
      order: [["createdAt", "ASC"]],
    });

    // Step 1: Set priority and assign full quantity if stock is available
    priorityOrder.is_priority = true;

    if (availableQuantity >= priorityOrder.order_quantity) {
      availableQuantity -= priorityOrder.order_quantity;
    } else {
      // Step 2: If not enough stock, take from other orders
      let neededQuantity = priorityOrder.order_quantity - availableQuantity;
      availableQuantity = 0;

      for (const order of allOrders) {
        if (order.order_config_id === priorityOrderId) continue; // Skip priority order

        if (order.order_quantity <= neededQuantity) {
          neededQuantity -= order.order_quantity;
          order.order_quantity = 0; // Fully removed
          await order.destroy();
        } else {
          order.order_quantity -= neededQuantity;
          neededQuantity = 0;
          await order.save();
        }

        if (neededQuantity === 0) break;
      }
    }

    // Update priority order & stock
    await priorityOrder.save();
    finishedStore.available_quantity = availableQuantity;
    await finishedStore.save();

    res.status(200).json({
      message: "Order priority updated & stock reallocated",
      updated_priority_order: priorityOrder,
      remaining_available_quantity: availableQuantity,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};
  
// Get all Order Config
exports.getAllOrderConfig = async (req, res, next) => {
    try {
        const OrderConfigs = await OrderConfig.findAll();
        res.status(200).json(OrderConfigs);
    } catch (error) {
        next(error);
    }
};

// Get a Order Config by ID 
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

exports.updateOrderConfig = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = OrderConfigSchema.parse(req.body);

    const dataToSave = {
      ...validatedData,
      product_id: validatedData?.product_id ? parseInt(validatedData.product_id, 10) : null,
      order_quantity: validatedData?.order_quantity ? parseInt(validatedData.order_quantity, 10) : null,
    };

    const existingOrder = await OrderConfig.findOne({ where: { order_config_id: id } });
    if (!existingOrder) {
      return res.status(404).json({ message: "Order ID not found" });
    }

    const existingProduct = await FinishedStore.findOne({ where: { product_id: dataToSave.product_id } });
    if (!existingProduct) {
      return res.status(404).json({ message: "Product ID not found" });
    }

    let availableStock = existingProduct.available_quantity;

    // Check if requested order quantity exceeds available stock
    if (dataToSave.order_quantity > availableStock) {
      return res.status(400).json({
        message: "Insufficient stock. Order cannot be processed.",
        available_quantity: availableStock,
      });
    }

    // Deduct stock for the new order
    existingProduct.available_quantity -= dataToSave.order_quantity;
    await existingProduct.save();

    // Update Order
    await OrderConfig.update(
      { ...validatedData, is_priority: true, status: true, is_confirmed: true },
      { where: { order_config_id: id } }
    );

    // Fetch Updated Order
    const updatedOrderConfig = await OrderConfig.findByPk(id);
    const updateOrder = updatedOrderConfig.toJSON();

    res.status(200).json({
      order_config_id: updateOrder.order_config_id,
      product_id: updateOrder.product_id,
      order_quantity: updateOrder.order_quantity,
      is_confirmed: updateOrder.is_confirmed,
      status: updateOrder.status,
      createdAt: updateOrder.updatedAt.toISOString().split("T")[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

// Delete a Order Config ID
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
