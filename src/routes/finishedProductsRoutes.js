// routes/finishedProductsRoutes.js
const express = require('express');
const { createFinishedProducts, getAllFinishedProducts, getFinishedProductById, updateFinishedProducts, deleteFinishedProducts } = require('../controllers/finishedProductController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: FinishedProducts
 *   description: API for managing finished Products
 */

/**
 * @swagger
 * /api/v1/finished-products:
 *   post:
 *     summary: Create a new finished Products entry
 *     tags: [FinishedProducts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: ID of the associated Products
 *                 example: "1"
 *               manufactured_date:
 *                 type: string
 *                 description: Manufacture date in YYYY-MM-DD format
 *                 example: "2023-10-01"
 *               manufactured_quantity:
 *                 type: string
 *                 description: Quantity of Products manufactured
 *                 example: "100"
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post('/', createFinishedProducts);

/**
 * @swagger
 * /api/v1/finished-products:
 *   get:
 *     summary: Get all finished Products entries
 *     tags: [FinishedProducts]
 *     responses:
 *       200:
 *         description: A list of finished Products entries
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
 *     summary: Get a finished Products entry by ID
 *     tags: [FinishedProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the finished Products entry
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested finished Products entry
 *       404:
 *         description: Finished Products not found
 */
router.get('/:id', getFinishedProductById);

/**
 * @swagger
 * /api/v1/finished-products/{id}:
 *   put:
 *     summary: Update a finished Products entry by ID
 *     tags: [FinishedProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the finished Products entry to update
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
 *         description: Finished Products not found
 */
router.put('/:id', updateFinishedProducts);

/**
 * @swagger
 * /api/v1/finished-products/{id}:
 *   delete:
 *     summary: Delete a finished Products entry by ID
 *     tags: [FinishedProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the finished Products entry to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Finished Products deleted successfully
 *       404:
 *         description: Finished Products not found
 */
router.delete('/:id', deleteFinishedProducts);

module.exports = router;
