// routes/ComponentRoutes.js
const express = require('express');
const { createComponent, getAllComponents, getComponentById, updateComponent, deleteComponent } = require('../controllers/componentController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Components
 *   description: API for managing Components
 */

/**
 * @swagger
 * /api/v1/Components:
 *   post:
 *     summary: Create a new Component
 *     tags: [Components]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *                 description: The ID of the Component category
 *                 example: 1
 *               component_name:
 *                 type: string
 *                 description: Name of the Component
 *                 example: "Smartphone"
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post('/', createComponent);

/**
 * @swagger
 * /api/v1/Components:
 *   get:
 *     summary: Get all Components
 *     tags: [Components]
 *     responses:
 *       200:
 *         description: A list of Components
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   component_id:
 *                     type: integer
 *                     example: 1
 *                   category_id:
 *                     type: integer
 *                     example: 1
 *                   component_name:
 *                     type: string
 *                     example: "Smartphone"
 */
router.get('/', getAllComponents);

/**
 * @swagger
 * /api/v1/Components/{id}:
 *   get:
 *     summary: Get a Component by ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the Component
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested Component
 *       404:
 *         description: Component not found
 */
router.get('/:id', getComponentById);

/**
 * @swagger
 * /api/v1/Components/{id}:
 *   put:
 *     summary: Update a Component by ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the Component to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 2
 *               component_name:
 *                 type: string
 *                 example: "Laptop"
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Component not found
 */
router.put('/:id', updateComponent);

/**
 * @swagger
 * /api/v1/Components/{id}:
 *   delete:
 *     summary: Delete a Component by ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the Component to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Component deleted successfully
 *       404:
 *         description: Component not found
 */
router.delete('/:id', deleteComponent);

module.exports = router;
