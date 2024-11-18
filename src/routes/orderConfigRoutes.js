// routes/OrderConfigRoutes.js
const express = require('express');
const { createOrderConfig, getAllOrderConfig, getOrderConfigById, updateOrderConfig, deleteOrderConfig } = require('../controllers/orderConfigController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OrderConfig
 *   description: API for managing Order Configurations
 */

/**
 * @swagger
 * /api/v1/order-config:
 *   post:
 *     summary: Create a new OrderConfig
 *     tags: [OrderConfig]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: ID of the product
 *                 example: "1"
 *               order_quantity:
 *                 type: string
 *                 description: Quantity of the product to order
 *                 example: "100"
 *     responses:
 *       201:
 *         description: OrderConfig created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', createOrderConfig);

/**
 * @swagger
 * /api/v1/order-config:
 *   get:
 *     summary: Get all OrderConfigs
 *     tags: [OrderConfig]
 *     responses:
 *       200:
 *         description: A list of OrderConfigs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   order_config_id:
 *                     type: integer
 *                     description: ID of the order configuration
 *                     example: 1
 *                   product_id:
 *                     type: integer
 *                     description: Product ID associated with the order
 *                     example: 1
 *                   order_quantity:
 *                     type: integer
 *                     description: Quantity of product to order
 *                     example: 100
 */
router.get('/', getAllOrderConfig);

/**
 * @swagger
 * /api/v1/order-config/{id}:
 *   get:
 *     summary: Get an OrderConfig by ID
 *     tags: [OrderConfig]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the OrderConfig to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested OrderConfig
 *       404:
 *         description: OrderConfig not found
 */
router.get('/:id', getOrderConfigById);

/**
 * @swagger
 * /api/v1/order-config/{id}:
 *   put:
 *     summary: Update an OrderConfig by ID
 *     tags: [OrderConfig]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the OrderConfig to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: ID of the product
 *                 example: "2"
 *               order_quantity:
 *                 type: string
 *                 description: Quantity of the product to order
 *                 example: "200"
 *     responses:
 *       200:
 *         description: OrderConfig updated successfully
 *       404:
 *         description: OrderConfig not found
 *       400:
 *         description: Invalid input
 */
router.put('/:id', updateOrderConfig);

/**
 * @swagger
 * /api/v1/order-config/{id}:
 *   delete:
 *     summary: Delete an OrderConfig by ID
 *     tags: [OrderConfig]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the OrderConfig to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OrderConfig deleted successfully
 *       404:
 *         description: OrderConfig not found
 */
router.delete('/:id', deleteOrderConfig);

module.exports = router;
