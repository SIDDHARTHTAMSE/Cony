// routes/purchaseStoreRoutes.js
const express = require('express');
const {
  createPurchaseStore,
  getAllPurchaseStores,
  getPurchaseStoreById,
  updatePurchaseStoreById,
  deletePurchaseStoreById
} = require('../controllers/purchasedStoreController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PurchaseStores
 *   description: API for managing purchase stores
 */

/**
 * @swagger
 * /api/v1/purchase-store:
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
 *               component_id:
 *                 type: string
 *                 description: ID of the associated Component
 *                 example: "1"
 *               available_quantity:
 *                 type: string
 *                 description: Available quantity of the Component
 *                 example: "100"
 *     responses:
 *       201:
 *         description: Purchase store entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 purchase_store_id:
 *                   type: integer
 *                   example: 1
 *                 component_id:
 *                   type: integer
 *                   example: 1
 *                 available_quantity:
 *                   type: integer
 *                   example: 100
 *       400:
 *         description: Bad Request
 */
router.post('/', createPurchaseStore);

/**
 * @swagger
 * /api/v1/purchase-store:
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
 *                   component_id:
 *                     type: integer
 *                     example: 1
 *                   available_quantity:
 *                     type: integer
 *                     example: 100
 */
router.get('/', getAllPurchaseStores);

/**
 * @swagger
 * /api/v1/purchase-store/{purchase_store_id}:
 *   get:
 *     summary: Get a purchase store entry by ID
 *     tags: [PurchaseStores]
 *     parameters:
 *       - in: path
 *         name: purchase_store_id
 *         required: true
 *         description: The ID of the purchase store entry
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested purchase store entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 purchase_store_id:
 *                   type: integer
 *                   example: 1
 *                 component_id:
 *                   type: integer
 *                   example: 1
 *                 available_quantity:
 *                   type: integer
 *                   example: 100
 *       404:
 *         description: PurchaseStore not found
 */
router.get('/:purchase_store_id', getPurchaseStoreById);

/**
 * @swagger
 * /api/v1/purchase-store/{purchase_store_id}:
 *   put:
 *     summary: Update a purchase store entry by ID
 *     tags: [PurchaseStores]
 *     parameters:
 *       - in: path
 *         name: purchase_store_id
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
 *               component_id:
 *                 type: string
 *                 example: "2"
 *               available_quantity:
 *                 type: string
 *                 example: "50"
 *     responses:
 *       200:
 *         description: Purchase store entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 purchase_store_id:
 *                   type: integer
 *                   example: 1
 *                 component_id:
 *                   type: integer
 *                   example: 2
 *                 available_quantity:
 *                   type: integer
 *                   example: 50
 *       404:
 *         description: PurchaseStore not found
 */
router.put('/:purchase_store_id', updatePurchaseStoreById);

/**
 * @swagger
 * /api/v1/purchase-store/{purchase_store_id}:
 *   delete:
 *     summary: Delete a purchase store entry by ID
 *     tags: [PurchaseStores]
 *     parameters:
 *       - in: path
 *         name: purchase_store_id
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
router.delete('/:purchase_store_id', deletePurchaseStoreById);

module.exports = router;
