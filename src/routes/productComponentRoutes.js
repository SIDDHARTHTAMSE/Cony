const express = require('express');
const {
  createProductComponent,
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
 *     summary: Create a new ProductComponent
 *     tags: [ProductComponents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: ID of the Product
 *                 example: "null"
 *               component_id:
 *                 type: string
 *                 description: ID of the Component
 *                 example: "null"
 *               quantity:
 *                 type: string
 *                 description: Quantity of Component in the Product
 *                 example: "10"
 *     responses:
 *       201:
 *         description: ProductComponent created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', createProductComponent);

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
