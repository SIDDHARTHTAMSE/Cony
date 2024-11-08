// routes/finishedProductRoutes.js
const express = require('express');
const { createFinishedProduct, getAllFinishedProducts, getFinishedProductById, updateFinishedProduct, deleteFinishedProduct } = require('../controllers/finishedProductController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: FinishedProducts
 *   description: API for managing finished products
 */

/**
 * @swagger
 * /api/v1/finished-products:
 *   post:
 *     summary: Create a new finished product entry
 *     tags: [FinishedProducts]
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
 *               manufactured_date:
 *                 type: string
 *                 description: Manufacture date in YYYY-MM-DD format
 *                 example: "2023-10-01"
 *               manufactured_quantity:
 *                 type: integer
 *                 description: Quantity of product manufactured
 *                 example: 100
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post('/', createFinishedProduct);

/**
 * @swagger
 * /api/v1/finished-products:
 *   get:
 *     summary: Get all finished product entries
 *     tags: [FinishedProducts]
 *     responses:
 *       200:
 *         description: A list of finished product entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   finished_product_id:
 *                     type: integer
 *                     example: 1
 *                   product_id:
 *                     type: integer
 *                     example: 1
 *                   manufactured_date:
 *                     type: string
 *                     example: "2023-10-01"
 *                   manufactured_quantity:
 *                     type: integer
 *                     example: 100
 */
router.get('/', getAllFinishedProducts);

/**
 * @swagger
 * /api/v1/finished-products/{id}:
 *   get:
 *     summary: Get a finished product entry by ID
 *     tags: [FinishedProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the finished product entry
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested finished product entry
 *       404:
 *         description: Finished product not found
 */
router.get('/:id', getFinishedProductById);

/**
 * @swagger
 * /api/v1/finished-products/{id}:
 *   put:
 *     summary: Update a finished product entry by ID
 *     tags: [FinishedProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the finished product entry to update
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
 *               manufactured_date:
 *                 type: string
 *                 example: "2023-11-15"
 *               manufactured_quantity:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Finished product not found
 */
router.put('/:id', updateFinishedProduct);

/**
 * @swagger
 * /api/v1/finished-products/{id}:
 *   delete:
 *     summary: Delete a finished product entry by ID
 *     tags: [FinishedProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the finished product entry to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Finished product deleted successfully
 *       404:
 *         description: Finished product not found
 */
router.delete('/:id', deleteFinishedProduct);

module.exports = router;
