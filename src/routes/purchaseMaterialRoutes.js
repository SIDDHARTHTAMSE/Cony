const express = require('express');
const { getPurchaseMaterials, getComponentWithSubComponents, getPurchaseRequirements, getOrderRequirements, getComponentDetails, getAllComponentDetails, getOrderAvailabilityStatus, } = require('../controllers/purchaseMaterials');

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


/**
 * @swagger
 * /api/v1/inventory-management/component-subcomponent:
 *   get:
 *     summary: Retrieve all categories with their components and subcomponents
 *     tags: [Purchase Materials]
 *     responses:
 *       200:
 *         description: A list of all categories, their components, and subcomponents.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category_name:
 *                     type: string
 *                     description: The name of the category.
 *                     example: "Electronics"
 *                   components:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         component_name:
 *                           type: string
 *                           description: The name of the component.
 *                           example: "Processor"
 *                         subcomponents:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: A list of subcomponent names associated with the component.
 *                           example: ["Intel i7", "AMD Ryzen 5"]
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/component-subcomponent', getComponentWithSubComponents);

/**
 * @swagger
 * /api/v1/inventory-management:
 *   get:
 *     summary: Fetch all components with available quantity and purchase order required
 *     description: Retrieves the list of components with their available quantity and purchase order required.
 *     tags: [Purchase Materials]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Component_Name:
 *                     type: string
 *                     example: "VX312"
 *                   Available_Quantity:
 *                     type: integer
 *                     example: 1200
 *                   Purchase_Order_Required:
 *                     type: integer
 *                     example: 1500
 *       500:
 *         description: Internal server error
 */
router.get('/', getPurchaseRequirements);

/**
 * @swagger
 * /api/v1/inventory-management/orders:
 *   get:
 *     summary: Retrieve remaining required quantity for each product
 *     tags: [Purchase Materials]
 *     responses:
 *       200:
 *         description: A list of products with order, available quantities, and remaining required quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Product_Name:
 *                     type: string
 *                     example: "watch1"
 *                   Order_Quantity:
 *                     type: integer
 *                     example: 500
 *                   Available_Quantity:
 *                     type: integer
 *                     example: 200
 *                   Remaining_Required_Quantity:
 *                     type: integer
 *                     example: 300
 *       500:
 *         description: Internal Server Error
 */
router.get('/orders', getOrderRequirements);

/**
 * @swagger
 * /api/v1/inventory-management/component-details:
 *   get:
 *     summary: Retrieve component details with shortage and purchase order required
 *     tags: [Purchase Materials]
 *     description: Fetches details of all components, including required quantity, available stock, shortages, raw material availability, and purchase orders needed.
 *     responses:
 *       200:
 *         description: A list of components with their inventory details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Component_Id:
 *                     type: integer
 *                     description: The unique identifier of the component.
 *                     example: 101
 *                   Component_Name:
 *                     type: string
 *                     description: The name of the component.
 *                     example: "VX312"
 *                   Required_Quantity:
 *                     type: integer
 *                     description: The total quantity required to fulfill orders.
 *                     example: 500
 *                   Available_Quantity:
 *                     type: integer
 *                     description: The available quantity of the component in stock.
 *                     example: 200
 *                   Shortage:
 *                     type: integer
 *                     description: The shortage amount (Required - Available).
 *                     example: 300
 *                   Raw_Material_Available:
 *                     type: integer
 *                     description: The available raw material that can be used to manufacture the component.
 *                     example: 100
 *                   Purchase_Order_Required:
 *                     type: integer
 *                     description: The final quantity required after considering available raw materials.
 *                     example: 250
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/component-details', getComponentDetails);

/**
 * @swagger
 * /api/v1/inventory-management/components:
 *   get:
 *     summary: Retrieve component details with shortage and purchase order required
 *     tags: [Purchase Materials]
 *     description: Fetches all components with their required quantity, available quantity, shortage, and purchase order required.
 *     responses:
 *       200:
 *         description: A list of components with required quantity, available quantity, shortage, and purchase order required.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Component_Id:
 *                     type: integer
 *                     description: The unique ID of the component.
 *                     example: 1
 *                   Component_Name:
 *                     type: string
 *                     description: The name of the component.
 *                     example: "xyz"
 *                   Required_Quantity:
 *                     type: integer
 *                     description: The total required quantity for the component.
 *                     example: 600
 *                   Available_Quantity:
 *                     type: integer
 *                     description: The available quantity of the component in stock.
 *                     example: 100
 *                   Shortage:
 *                     type: integer
 *                     description: The shortage amount (Required - Available).
 *                     example: 500
 *                   Purchase_Order_Required:
 *                     type: integer
 *                     description: The final quantity required after considering available stock.
 *                     example: 500
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/components', getAllComponentDetails);

/**
 * @swagger
 * /api/v1/inventory-management/orders-status:
 *   get:
 *     summary: Retrieve order status and update available quantity based on order requirements
 *     tags: [Purchase Materials]
 *     responses:
 *       200:
 *         description: A list of orders with their product names, quantities, and status whether the order can be placed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Order_ID:
 *                     type: integer
 *                     example: 1
 *                   Product_Name:
 *                     type: string
 *                     example: "Product A"
 *                   Order_Quantity:
 *                     type: integer
 *                     example: 15
 *                   Available_Quantity:
 *                     type: integer
 *                     example: 50
 *                   Remaining_Required_Quantity:
 *                     type: integer
 *                     example: 0
 *                   is_order_possible:
 *                     type: boolean
 *                     description: Indicates whether the order can be fulfilled based on available stock
 *                     example: true
 *       500:
 *         description: Internal Server Error
 */
router.get('/orders-status', getOrderAvailabilityStatus);

module.exports = router;
