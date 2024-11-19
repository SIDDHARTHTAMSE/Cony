const express = require('express');
const { getOrderManagement, getProductList } = require('../controllers/productConfigurationController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Order Management
 *     description: API for managing order data
 *   - name: Product List
 *     description: API for fetching product list data
 */

/**
 * @swagger
 * /api/v1/productConfiguration/order-management:
 *   get:
 *     summary: Retrieve order management data
 *     tags: [Order Management]
 *     responses:
 *       200:
 *         description: A list of order management data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Order_ID:
 *                     type: integer
 *                     example: 1
 *                   Product_Name:
 *                     type: string
 *                     example: "Phone"
 *                   Order_Quantity:
 *                     type: integer
 *                     example: 10
 *                   Component_Name:
 *                     type: string
 *                     example: "Screen"
 *                   Total_Required_Quantity:
 *                     type: integer
 *                     example: 50
 *                   Available_Quantity:
 *                     type: integer
 *                     example: 30
 *       500:
 *         description: Internal Server Error
 */
router.get('/order-management', getOrderManagement);
/**
 * @swagger
 * /api/v1/productConfiguration/products:
 *   get:
 *     summary: Retrieve product list data
 *     tags: [Product List]
 *     responses:
 *       200:
 *         description: A list of product data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Product_ID:
 *                     type: integer
 *                     example: 1
 *                   Product_Name:
 *                     type: string
 *                     example: "Phone"
 *                   Component_Name:
 *                     type: string
 *                     example: "Screen"
 *                   Quantity:
 *                     type: integer
 *                     example: 100
 *       500:
 *         description: Internal Server Error
 */
router.get('/products', getProductList);

module.exports = router;
