// routes/purchaseRoutes.js
const express = require('express');
const {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
} = require('../controllers/purchaseController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: API for managing purchases
 */

/**
 * @swagger
 * /api/v1/purchases:
 *   post:
 *     summary: Create a new purchase
 *     tags: [Purchases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purchase_date:
 *                 type: string
 *                 example: "2024-11-05"
 *               purchased_quantity:
 *                 type: string
 *                 example: "10"
 *               component_id:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post('/', createPurchase);

/**
 * @swagger
 * /api/v1/purchases:
 *   get:
 *     summary: Get all purchases
 *     tags: [Purchases]
 *     responses:
 *       200:
 *         description: A list of purchases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   purchase_date:
 *                     type: string
 *                     example: "2024-11-05"
 *                   purchased_quantity:
 *                     type: integer
 *                     example: 10
 *                   component_id:
 *                     type: integer
 *                     example: 1
 *                   Component:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Laptop"
 */
router.get('/', getPurchases);

/**
 * @swagger
 * /api/v1/purchases/{id}:
 *   get:
 *     summary: Get a purchase by ID
 *     tags: [Purchases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the purchase
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested purchase
 *       404:
 *         description: Purchase not found
 */
router.get('/:id', getPurchaseById);

/**
 * @swagger
 * /api/v1/purchases/{id}:
 *   put:
 *     summary: Update a purchase by ID
 *     tags: [Purchases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the purchase to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purchase_date:
 *                 type: string
 *                 example: "2024-11-05"
 *               purchased_quantity:
 *                 type: string
 *                 example: "15"
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Purchase not found
 */
router.put('/:id', updatePurchase);

/**
 * @swagger
 * /api/v1/purchases/{id}:
 *   delete:
 *     summary: Delete a purchase by ID
 *     tags: [Purchases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the purchase to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase deleted successfully
 *       404:
 *         description: Purchase not found
 */
router.delete('/:id', deletePurchase);

module.exports = router;
