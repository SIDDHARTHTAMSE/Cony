const express = require('express');
const {
  createProductComponents,
  getAllProductComponent,
  getProductComponentById,
  updateProductComponent,
  deleteProductComponent
} = require('../controllers/productComponentController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ProductComponents
 *   description: API for managing ProductComponents
 */

/**
 * @swagger
 * /api/v1/productComponents:
 *   post:
 *     summary: Create one or multiple ProductComponents
 *     tags: [ProductComponents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 product_id:
 *                   type: string
 *                   description: ID of the Product
 *                   example: "101"
 *                 component_id:
 *                   type: string
 *                   description: ID of the Component (must be unique for the Product)
 *                   example: "201"
 *                 quantity:
 *                   type: string
 *                   description: Quantity of the Component in the Product
 *                   example: "10"
 *     responses:
 *       201:
 *         description: ProductComponents created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ProductComponents created successfully."
 *                 components:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: string
 *                         description: ID of the Product
 *                         example: "101"
 *                       component_id:
 *                         type: string
 *                         description: ID of the Component
 *                         example: "201"
 *                       quantity:
 *                         type: string
 *                         description: Quantity of the Component
 *                         example: "10"
 *       400:
 *         description: Validation error or duplicate component ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       component_id:
 *                         type: string
 *                         description: The duplicate or invalid Component ID
 *                         example: "201"
 *                       message:
 *                         type: string
 *                         description: Error message for the invalid component
 *                         example: "Component ID '201' already exists."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "An unexpected error occurred."
 */
router.post('/', createProductComponents);

/**
 * @swagger
 * /api/v1/productComponents:
 *   get:
 *     summary: Get all ProductComponents
 *     tags: [ProductComponents]
 *     responses:
 *       200:
 *         description: List of ProductComponents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_component_id:
 *                     type: integer
 *                     example: 1
 *                   product_id:
 *                     type: integer
 *                     example: 1
 *                   component_id:
 *                     type: integer
 *                     example: 2
 *                   quantity:
 *                     type: integer
 *                     example: 10
 */
router.get('/', getAllProductComponent);

/**
 * @swagger
 * /api/v1/productComponents/{id}:
 *   get:
 *     summary: Get a ProductComponent by ID
 *     tags: [ProductComponents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the ProductComponent
 *     responses:
 *       200:
 *         description: A single ProductComponent
 *       404:
 *         description: ProductComponent not found
 */
router.get('/:id', getProductComponentById);

/**
 * @swagger
 * /api/v1/productComponents/{id}:
 *   put:
 *     summary: Update a ProductComponent by ID
 *     tags: [ProductComponents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the ProductComponent to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 example: "1"
 *               component_id:
 *                 type: string
 *                 example: "2"
 *               quantity:
 *                 type: string
 *                 example: "20"
 *     responses:
 *       200:
 *         description: Updated ProductComponent
 *       404:
 *         description: ProductComponent not found
 */
router.put('/:id', updateProductComponent);

/**
 * @swagger
 * /api/v1/productComponents/{id}:
 *   delete:
 *     summary: Delete a ProductComponent by ID
 *     tags: [ProductComponents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the ProductComponent to delete
 *     responses:
 *       200:
 *         description: ProductComponent deleted successfully
 *       404:
 *         description: ProductComponent not found
 */
router.delete('/:id', deleteProductComponent);

module.exports = router;
