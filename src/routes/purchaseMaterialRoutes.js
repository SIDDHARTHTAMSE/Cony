const express = require('express');
const { getPurchaseMaterials } = require('../controllers/purchaseMaterials');

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Purchase Materials
 *   description: API for managing inventory data
 */

/**
 * @swagger
 * /api/v1/inventory-management/purchase-materials:
 *   get:
 *     summary: Retrieve purchase material data
 *     tags: [Purchase Materials]
 *     responses:
 *       200:
 *         description: A list of purchase material data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Purchase_ID:
 *                     type: integer
 *                     example: 101
 *                   Purchase_Date:
 *                     type: string
 *                     format: date
 *                     example: "2024-12-01"
 *                   Component_Name:
 *                     type: string
 *                     example: "Aluminum Sheet"
 *                   Component_Category:
 *                     type: string
 *                     example: "Raw Material"
 *       500:
 *         description: Internal Server Error
 */
router.get('/purchase-materials', getPurchaseMaterials);

module.exports = router;
