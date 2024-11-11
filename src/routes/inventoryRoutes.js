// routes/inventoryRoutes.js
const express = require('express');
const { getFinishedGoodsData, getRawMaterialInventoryData } = require('../controllers/inventoryManagementController.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: API for managing inventory data
 */

/**
 * @swagger
 * /api/v1/inventory-management/raw-materials:
 *   get:
 *     summary: Retrieve raw material inventory data
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: A list of raw material inventory data
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
 *                   component_name:
 *                     type: string
 *                     example: "Steel Rod"
 *                   Component_Category:
 *                     type: string
 *                     example: "Raw Material"
 *                   Available_Quantity:
 *                     type: integer
 *                     example: 1000
 *       500:
 *         description: Internal Server Error
 */
router.get('/raw-materials', getRawMaterialInventoryData);

/**
 * @swagger
 * /api/v1/inventory-management/finished-goods:
 *   get:
 *     summary: Retrieve finished goods inventory data
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: A list of finished goods inventory data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Manufactured_Date:
 *                     type: string
 *                     example: "2023-10-01"
 *                   component_id:
 *                     type: integer
 *                     example: 2
 *                   component_name:
 *                     type: string
 *                     example: "Wrench"
 *                   Component_Category:
 *                     type: string
 *                     example: "Tools"
 *                   Manufactured_Quantity:
 *                     type: integer
 *                     example: 500
 *                   Available_Quantity:
 *                     type: integer
 *                     example: 300
 *       500:
 *         description: Internal Server Error
 */
router.get('/finished-goods', getFinishedGoodsData);

module.exports = router;
