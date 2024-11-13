const OrderConfig = require('../models/orderConfig');
const { z } = require('zod');

const OrderConfigSchema = z.object({
    product_id: z.number().min(1, "Product ID is required"),
    order_quantity: z.number().positive("Order Quantity must be greater than 0"),
});

exports.createOrderConfig = async (req, res, next) => {
    try {
        const validatedData = OrderConfigSchema.parse(req.body);
        const newOrderConfig = await OrderConfig.create(validatedData);
        res.status(201).json(newOrderConfig);
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