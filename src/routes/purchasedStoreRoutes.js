// routes/purchaseRoutes.js
const express = require('express');
const { createPurchaseStore, getAllPurchaseStores, getPurchaseStoreById, updatePurchaseStore, deletePurchaseStore } = require('../controllers/purchasedStoreController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PurchaseStores
 *   description: API for managing purchase stores
 */

/**
 * @swagger
 * /api/v1/purchaseStores:
 *   post:
 *     summary: Create a new purchase store entry
 *     tags: [PurchaseStores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: ID of the associated product
 *                 example: 1
 *               available_quantity:
 *                 type: integer
 *                 description: Available quantity of the product
 *                 example: 100
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post('/', createPurchaseStore);

/**
 * @swagger
 * /api/v1/purchaseStores:
 *   get:
 *     summary: Get all purchase store entries
 *     tags: [PurchaseStores]
 *     responses:
 *       200:
 *         description: A list of purchase store entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   purchase_store_id:
 *                     type: integer
 *                     example: 1
 *                   product_id:
 *                     type: integer
 *                     example: 1
 *                   available_quantity:
 *                     type: integer
 *                     example: 100
 */
router.get('/', getAllPurchaseStores);

/**
 * @swagger
 * /api/v1/purchaseStores/{id}:
 *   get:
 *     summary: Get a purchase store entry by ID
 *     tags: [PurchaseStores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the purchase store entry
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested purchase store entry
 *       404:
 *         description: PurchaseStore not found
 */
router.get('/:id', getPurchaseStoreById);

/**
 * @swagger
 * /api/v1/purchaseStores/{id}:
 *   put:
 *     summary: Update a purchase store entry by ID
 *     tags: [PurchaseStores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the purchase store entry to update
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
 *                 type: integer
 *                 example: 2
 *               available_quantity:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: PurchaseStore not found
 */
router.put('/:id', updatePurchaseStore);

/**
 * @swagger
 * /api/v1/purchaseStores/{id}:
 *   delete:
 *     summary: Delete a purchase store entry by ID
 *     tags: [PurchaseStores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the purchase store entry to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PurchaseStore deleted successfully
 *       404:
 *         description: PurchaseStore not found
 */
router.delete('/:id', deletePurchaseStore);

module.exports = router;
