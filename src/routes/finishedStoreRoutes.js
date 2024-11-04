const express = require('express');
const {
  createFinishedStore,
  getAllFinishedStores,
  getFinishedStoreById,
  updateFinishedStore,
  deleteFinishedStore,
} = require('../controllers/finishedStoreController'); // Adjust the path as necessary

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
 *               name:
 *                 type: string
 *                 example: Warehouse A
 *               location:
 *                 type: string
 *                 example: Downtown
 *     responses:
 *       201:
 *         description: Created
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
 *                   id:
 *                     type: string
 *                     example: "123"
 *                   name:
 *                     type: string
 *                     example: Warehouse A
 *                   location:
 *                     type: string
 *                     example: Downtown
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
 *           type: string
 *     responses:
 *       200:
 *         description: The requested finished store
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
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Warehouse A
 *               location:
 *                 type: string
 *                 example: New Location
 *     responses:
 *       200:
 *         description: Updated
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
 *           type: string
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Not Found
 */
router.delete('/:id', deleteFinishedStore);

module.exports = router;