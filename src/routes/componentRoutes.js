// routes/ComponentRoutes.js
const express = require('express');
const { createComponent, getAllComponents, getComponentById, getComponentsByName, updateComponent, deleteComponent } = require('../controllers/componentController');

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
 *     summary: Create multiple Components
 *     tags: [Components]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 category_id:
 *                   type: string
 *                   description: The ID of the Component category
 *                   example: "1"
 *                 component_name:
 *                   type: string
 *                   description: Name of the Component
 *                   example: "Processor"
 *     responses:
 *       201:
 *         description: Components created successfully.
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
 *                       id:
 *                         type: integer
 *                         description: The ID of the created component.
 *                         example: 1
 *                       component_name:
 *                         type: string
 *                         description: The name of the component.
 *                         example: "Processor"
 *                       category_id:
 *                         type: integer
 *                         description: The category ID of the component.
 *                         example: 101
 *       409:
 *         description: Conflict. A component with the same name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Component with name 'Processor' already exists."
 *       400:
 *         description: Bad request. Validation error.
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
 *                         example: "Component name is required."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "An unexpected error occurred."
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
 * /api/v1/Components/name:
 *   post:
 *     summary: Get a component by its name
 *     tags: [Components]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               component_name:
 *                 type: string
 *                 example: "Resistor"
 *                 description: Name of the component to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the component
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     component_id:
 *                       type: integer
 *                       example: 1
 *                     component_name:
 *                       type: string
 *                       example: "Resistor"
 *                     description:
 *                       type: string
 *                       example: "An electronic component used to resist current flow."
 *                 - type: object
 *                   properties:
 *                     component_id:
 *                       type: integer
 *                       example: 1
 *                     component_name:
 *                       type: string
 *                       example: "Resistor"
 *                     description:
 *                       type: string
 *                       example: "An electronic component used to resist current flow."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-01T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-02T14:00:00Z"
 *       404:
 *         description: Component not found or name not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Component Name required"
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
router.post('/name', getComponentsByName);

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
 *                 type: string
 *                 example: "2"
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
