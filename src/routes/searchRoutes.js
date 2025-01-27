const express = require('express');
const { searchItems } = require('../controllers/searchController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: API for searching components, products, and finished products
 */

/**
 * @swagger
 * /api/v1/search:
 *   post:
 *     summary: Search for components, products, and finished products based on a search term
 *     tags: [Search]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchTerm:
 *                 type: string
 *                 description: The keyword to search for in the component, product, and finished product names
 *                 example: "widget"
 *     responses:
 *       200:
 *         description: Search results found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 components:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       component_id:
 *                         type: integer
 *                         example: 1
 *                       component_name:
 *                         type: string
 *                         example: "Widget A"
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                         example: 101
 *                       product_name:
 *                         type: string
 *                         example: "Product A"
 *                 finishedProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       finished_product_id:
 *                         type: integer
 *                         example: 5001
 *                       finished_product_name:
 *                         type: string
 *                         example: "Finished Widget A"
 *       400:
 *         description: Bad Request, search term is missing
 *       500:
 *         description: Internal Server Error
 */

router.post('/', searchItems);

module.exports = router;