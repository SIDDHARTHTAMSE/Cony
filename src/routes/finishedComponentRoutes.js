// routes/finishedComponentRoutes.js
const express = require('express');
const { createFinishedComponent, getAllFinishedComponents, getFinishedComponentById, updateFinishedComponent, deleteFinishedComponent } = require('../controllers/finishedComponentController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: FinishedComponents
 *   description: API for managing finished Components
 */

/**
 * @swagger
 * /api/v1/finished-Components:
 *   post:
 *     summary: Create a new finished Component entry
 *     tags: [FinishedComponents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               component_id:
 *                 type: string
 *                 description: ID of the associated Component
 *                 example: "1"
 *               manufactured_date:
 *                 type: string
 *                 description: Manufacture date in YYYY-MM-DD format
 *                 example: "2023-10-01"
 *               manufactured_quantity:
 *                 type: string
 *                 description: Quantity of Component manufactured
 *                 example: "100"
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post('/', createFinishedComponent);

/**
 * @swagger
 * /api/v1/finished-Components:
 *   get:
 *     summary: Get all finished Component entries
 *     tags: [FinishedComponents]
 *     responses:
 *       200:
 *         description: A list of finished Component entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   finished_component_id:
 *                     type: integer
 *                     example: 1
 *                   component_id:
 *                     type: integer
 *                     example: 1
 *                   manufactured_date:
 *                     type: string
 *                     example: "2023-10-01"
 *                   manufactured_quantity:
 *                     type: integer
 *                     example: 100
 */
router.get('/', getAllFinishedComponents);

/**
 * @swagger
 * /api/v1/finished-Components/{id}:
 *   get:
 *     summary: Get a finished Component entry by ID
 *     tags: [FinishedComponents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the finished Component entry
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested finished Component entry
 *       404:
 *         description: Finished Component not found
 */
router.get('/:id', getFinishedComponentById);

/**
 * @swagger
 * /api/v1/finished-Components/{id}:
 *   put:
 *     summary: Update a finished Component entry by ID
 *     tags: [FinishedComponents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the finished Component entry to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               component_id:
 *                 type: string
 *                 example: "2"
 *               manufactured_date:
 *                 type: string
 *                 example: "2023-11-15"
 *               manufactured_quantity:
 *                 type: string
 *                 example: "50"
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Finished Component not found
 */
router.put('/:id', updateFinishedComponent);

/**
 * @swagger
 * /api/v1/finished-Components/{id}:
 *   delete:
 *     summary: Delete a finished Component entry by ID
 *     tags: [FinishedComponents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the finished Component entry to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Finished Component deleted successfully
 *       404:
 *         description: Finished Component not found
 */
router.delete('/:id', deleteFinishedComponent);

module.exports = router;
