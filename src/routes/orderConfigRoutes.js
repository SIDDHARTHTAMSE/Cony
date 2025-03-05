// routes/OrderConfigRoutes.js
const express = require('express');
const { createOrderConfig, getAllOrderConfig, getOrderConfigById, updateOrderConfig, deleteOrderConfig, confirmOrder, setOrderPriority } = require('../controllers/orderConfigController');
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
 * /api/v1/order-config/set-priority:
 *   post:
 *     summary: Mark an order as priority
 *     tags: [OrderConfig]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: string
 *                 description: ID of the order to prioritize
 *                 example: "108"
 *     responses:
 *       200:
 *         description: Order marked as priority successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 */
router.post('/set-priority', setOrderPriority);

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

/**
 * @swagger
 * /api/v1/order-config/confirm-order:
 *   post:
 *     summary: Confirm an order based on availability of components in the store
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_config_id:
 *                 type: integer
 *                 example: 123
 *                 description: The ID of the order configuration to confirm
 *     responses:
 *       200:
 *         description: The order can be confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The order can be confirmed."
 *                 order_details:
 *                   type: object
 *                   properties:
 *                     order_config_id:
 *                       type: integer
 *                       example: 123
 *                     product_id:
 *                       type: integer
 *                       example: 456
 *                     order_quantity:
 *                       type: integer
 *                       example: 10
 *                     components:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           component_id:
 *                             type: integer
 *                             example: 789
 *                           message:
 *                             type: string
 *                             example: "Component ID 789 is available for order."
 *                           canConfirm:
 *                             type: boolean
 *                             example: true
 *       400:
 *         description: The order cannot be confirmed due to unavailable components or missing order_config_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The order cannot be confirmed. Some components are not available."
 *                 order_details:
 *                   type: object
 *                   properties:
 *                     order_config_id:
 *                       type: integer
 *                       example: 123
 *                     product_id:
 *                       type: integer
 *                       example: 456
 *                     order_quantity:
 *                       type: integer
 *                       example: 10
 *                     components:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           component_id:
 *                             type: integer
 *                             example: 789
 *                           message:
 *                             type: string
 *                             example: "Component ID 789, is insufficient"
 *                           canConfirm:
 *                             type: boolean
 *                             example: false
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order not found."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/confirm-order', confirmOrder);

module.exports = router;
