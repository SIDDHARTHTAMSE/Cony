// routes/products.js
const express = require('express');
const { createProduct, getAllProduct, getProductById, getProductByName, updatedProduct, deleteProduct } = require('../controllers/productsController');
const { route } = require('./categoryRoutes');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: "Laptop"
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post('/', createProduct);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_id:
 *                     type: integer
 *                     example: 1
 *                   product_name:
 *                     type: string
 *                     example: "Laptop"
 */
router.get('/', getAllProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested product
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/v1/products/name:
 *   post:
 *     summary: Get a product by its name
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: "Smartphone"
 *                 description: Name of the product to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the product
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 101
 *                     product_name:
 *                       type: string
 *                       example: "Smartphone"
 *                     description:
 *                       type: string
 *                       example: "A high-end smartphone with advanced features."
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 599.99
 *                 - type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 101
 *                     product_name:
 *                       type: string
 *                       example: "Smartphone"
 *                     description:
 *                       type: string
 *                       example: "A high-end smartphone with advanced features."
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 599.99
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-02T12:00:00Z"
 *       404:
 *         description: Product not found or name not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product is not found"
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
router.post('/name', getProductByName);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: "Smartphone"
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Product not found
 */
router.put('/:id', updatedProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', deleteProduct);

module.exports = router;
