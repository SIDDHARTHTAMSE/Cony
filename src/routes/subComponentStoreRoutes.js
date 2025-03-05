const express = require("express");
const {
  createSubComponentStore,
  getAllSubComponentStores,
  getSubComponentStoreById,
  updateSubComponentStore,
  deleteSubComponentStore,
} = require('../controllers/subComponentStoreController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SubComponentStore
 *   description: API for managing SubComponentStore
 */

/**
 * @swagger
 * /api/v1/subComponentStore:
 *   post:
 *     summary: Create a new SubComponentStore
 *     tags: [SubComponentStore]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subcomponents_id:
 *                 type: string
 *                 description: The ID of the SubComponent.
 *                 example: "1"
 *               quantity:
 *                 type: string
 *                 description: Quantity of the SubComponent.
 *                 example: "100"
 *     responses:
 *       201:
 *         description: SubComponentStore created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subcomponentstore_id:
 *                   type: integer
 *                   description: The ID of the created SubComponentStore.
 *                   example: 10
 *                 subcomponents_id:
 *                   type: string
 *                   description: The ID of the SubComponent.
 *                   example: "1"
 *                 quantity:
 *                   type: string
 *                   description: The stored quantity.
 *                   example: "100"
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubComponent ID is required."
 *       500:
 *         description: Internal server error.
 */
router.post("/", createSubComponentStore);

/**
 * @swagger
 * /api/v1/subComponentStore:
 *   get:
 *     summary: Get all SubComponentStores
 *     tags: [SubComponentStore]
 *     responses:
 *       200:
 *         description: Returns a list of all SubComponentStores.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   subcomponentstore_id:
 *                     type: integer
 *                     description: The ID of the SubComponentStore.
 *                     example: 10
 *                   subcomponents_id:
 *                     type: string
 *                     description: The ID of the SubComponent.
 *                     example: "1"
 *                   quantity:
 *                     type: string
 *                     description: The stored quantity.
 *                     example: "100"
 *       500:
 *         description: Internal server error.
 */
router.get("/", getAllSubComponentStores);

/**
 * @swagger
 * /api/v1/subComponentStore/{id}:
 *   get:
 *     summary: Get a SubComponentStore by ID
 *     tags: [SubComponentStore]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the SubComponentStore to retrieve.
 *     responses:
 *       200:
 *         description: SubComponentStore found.
 *       404:
 *         description: SubComponentStore not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", getSubComponentStoreById);

/**
 * @swagger
 * /api/v1/subComponentStore/{id}:
 *   put:
 *     summary: Update a SubComponentStore by ID
 *     tags: [SubComponentStore]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the SubComponentStore to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subcomponents_id:
 *                 type: string
 *                 description: The ID of the SubComponent.
 *                 example: "1"
 *               quantity:
 *                 type: string
 *                 description: Updated quantity.
 *                 example: "150"
 *     responses:
 *       200:
 *         description: SubComponentStore updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: SubComponentStore not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", updateSubComponentStore);

/**
 * @swagger
 * /api/v1/subComponentStore/{id}:
 *   delete:
 *     summary: Delete a SubComponentStore by ID
 *     tags: [SubComponentStore]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the SubComponentStore to delete.
 *     responses:
 *       200:
 *         description: SubComponentStore deleted successfully.
 *       404:
 *         description: SubComponentStore not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteSubComponentStore);

module.exports = router;
