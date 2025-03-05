// routes/finishedStoreRoutes.js
const express = require('express');
const {
  createFinishedStore,
  fulfillOrder,
  getAllFinishedStores,
  getFinishedStoreById,
  updateFinishedStore,
  deleteFinishedStore,
} = require('../controllers/finishedStoreController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Finished Stores
 *   description: API for managing finished store data
 */

/**
 * @swagger
 * /api/v1/finished-stores: 
 *   post:
 *     summary: Create a new finished store entry
 *     tags: [Finished Stores]
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
 *                 description: ID of the Component
 *               available_quantity:
 *                 type: string
 *                 example: "50"
 *                 description: Available quantity of the finished Component
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product_id:
 *                   type: integer
 *                 available_quantity:
 *                   type: integer
 *       400:
 *         description: Bad Request
 */
router.post('/', createFinishedStore);

/**
 * @swagger
 * /api/v1/finished-stores:
 *   get:
 *     summary: Get all finished stores
 *     tags: [Finished Stores]
 *     responses:
 *       200:
 *         description: A list of finished stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   finished_store_id:
 *                     type: integer
 *                     example: "1"
 *                   product_id:
 *                     type: integer
 *                     example: "1"
 *                   available_quantity:
 *                     type: integer
 *                     example: "100"
 */
router.get('/', getAllFinishedStores);

/**
 * @swagger
 * /api/v1/finished-stores/{id}:
 *   get:
 *     summary: Get a finished store by ID
 *     tags: [Finished Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the finished store
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested finished store
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 finished_store_id:
 *                   type: integer
 *                   example: 1
 *                 product_id:
 *                   type: integer
 *                   example: "1"
 *                 available_quantity:
 *                   type: integer
 *                   example: "100"
 *       404:
 *         description: Not Found
 */
router.get('/:id', getFinishedStoreById);

/**
 * @swagger
 * /api/v1/finished-stores/{id}:
 *   put:
 *     summary: Update a finished store by ID
 *     tags: [Finished Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the finished store to update
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
 *                 example: "1"
 *               available_quantity:
 *                 type: string
 *                 example: "200"
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 finished_store_id:
 *                   type: integer
 *                   example: 1
 *                 product_id:
 *                   type: integer
 *                   example: 1
 *                 available_quantity:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Not Found
 */
router.put('/:id', updateFinishedStore);

/**
 * @swagger
 * /api/v1/finished-stores/{id}:
 *   delete:
 *     summary: Delete a finished store by ID
 *     tags: [Finished Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the finished store to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "FinishedStore deleted successfully"
 *       404:
 *         description: Not Found
 */
router.delete('/:id', deleteFinishedStore);

module.exports = router;
