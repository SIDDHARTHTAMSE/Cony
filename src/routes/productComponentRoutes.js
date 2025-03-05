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
 *     summary: Create one or multiple Product Components
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
 *                   nullable: true
 *                   description: ID of the Product (optional, must be a string).
 *                   example: "18"
 *                 component_id:
 *                   type: string
 *                   nullable: true
 *                   description: ID of the Component (required if `subcomponents_id` is null).
 *                   example: "2"
 *                 subcomponents_id:
 *                   type: string
 *                   nullable: true
 *                   description: ID of the SubComponent (required if `component_id` is null).
 *                   example: "50"
 *                 quantity:
 *                   type: string
 *                   description: Quantity of the Component (must be a string).
 *                   example: "10"
 *     responses:
 *       201:
 *         description: ProductComponents created successfully.
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
 *                         nullable: true
 *                         description: ID of the Product.
 *                         example: "18"
 *                       component_id:
 *                         type: string
 *                         nullable: true
 *                         description: ID of the Component.
 *                         example: "2"
 *                       subcomponents_id:
 *                         type: string
 *                         nullable: true
 *                         description: ID of the SubComponent (optional, will be null if not provided).
 *                         example: "50"
 *                       quantity:
 *                         type: string
 *                         description: Quantity of the Component.
 *                         example: "10"
 *       400:
 *         description: Validation error (if both `component_id` and `subcomponents_id` are missing).
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
 *                       message:
 *                         type: string
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
 *     summary: Update a Product Component by ID
 *     tags: [ProductComponents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Product Component to update.
 *         example: 24
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 nullable: true
 *                 description: ID of the Product (optional).
 *                 example: "18"
 *               component_id:
 *                 type: string
 *                 nullable: true
 *                 description: ID of the Component (optional, required if `subcomponents_id` is null).
 *                 example: "2"
 *               subcomponents_id:
 *                 type: string
 *                 nullable: true
 *                 description: ID of the SubComponent (optional, required if `component_id` is null).
 *                 example: "50"
 *               quantity:
 *                 type: string
 *                 description: Quantity of the Component.
 *                 example: "10"
 *     responses:
 *       200:
 *         description: Successfully updated Product Component.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product_component_id:
 *                   type: integer
 *                   example: 24
 *                 product_id:
 *                   type: integer
 *                   example: 18
 *                 component_id:
 *                   type: integer
 *                   example: 2
 *                 subcomponents_id:
 *                   type: integer
 *                   nullable: true
 *                   example: 50
 *                 quantity:
 *                   type: integer
 *                   example: 10
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-02-11T07:38:44.292Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-02-11T07:45:12.502Z"
 *       400:
 *         description: Validation error or bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Either Component ID or SubComponent ID is required."
 *       404:
 *         description: Product Component not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ProductComponent not found or nothing to update."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
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
