const express = require('express');
const { createSubComponents, getAllSubComponents, getSubComponentsId, getSubComponentsByName, updateSubComponents, deleteSubComponent, softDeleteSubComponents, restoreSubComponent } = require('../controllers/subComponentsController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SubComponents
 *   description: API for managing SubComponents
 */

/**
 * @swagger
 * /api/v1/SubComponents:
 *   post:
 *     summary: Create multiple SubComponents
 *     tags: [SubComponents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 component_id:
 *                   type: string
 *                   description: The ID of the parent Component (optional).
 *                   example: "1"
 *                 subcomponents_name:
 *                   type: string
 *                   description: Name of the SubComponent.
 *                   example: "GPU"
 *     responses:
 *       201:
 *         description: SubComponents created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subComponents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subcomponents_id:
 *                         type: integer
 *                         description: The ID of the created SubComponent.
 *                         example: 10
 *                       component_id:
 *                         type: integer
 *                         description: The parent Component ID (nullable).
 *                         example: 1
 *                       subcomponents_name:
 *                         type: string
 *                         description: The name of the SubComponent.
 *                         example: "GPU"
 *       400:
 *         description: Bad request. Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubComponent name is required."
 *       409:
 *         description: Conflict. A SubComponent with the same name already exists or component_id is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubComponent with name 'GPU' already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "An unexpected error occurred."
 */
router.post('/', createSubComponents);

/**
 * @swagger
 * /api/v1/SubComponents:
 *   get:
 *     summary: Get all SubComponents
 *     tags: [SubComponents]
 *     responses:
 *       200:
 *         description: List of all SubComponents retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the SubComponent.
 *                     example: 10
 *                   subcomponents_name:
 *                     type: string
 *                     description: The name of the SubComponent.
 *                     example: "GPU 05"
 *                   component_id:
 *                     type: integer
 *                     description: The ID of the parent Component.
 *                     example: 2
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "An unexpected error occurred."
 */
router.get('/', getAllSubComponents)

/**
 * @swagger
 * /api/v1/SubComponents/{id}:
 *   get:
 *     summary: Get a SubComponent by ID
 *     tags: [SubComponents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the SubComponent to retrieve.
 *     responses:
 *       200:
 *         description: SubComponent retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subcomponents_id:
 *                   type: integer
 *                   description: The ID of the SubComponent.
 *                   example: 10
 *                 subcomponents_name:
 *                   type: string
 *                   description: The name of the SubComponent.
 *                   example: "GPU 05"
 *                 component_id:
 *                   type: integer
 *                   description: The ID of the parent Component.
 *                   example: 2
 *       404:
 *         description: SubComponent not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubComponent not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.get('/:id', getSubComponentsId);

/**
 * @swagger
 * /api/v1/SubComponents/by-name:
 *   post:
 *     summary: Get a SubComponent by Name
 *     tags: [SubComponents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subcomponents_name:
 *                 type: string
 *                 description: The name of the SubComponent to retrieve.
 *                 example: "GPU 05"
 *     responses:
 *       200:
 *         description: SubComponent retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subcomponents_id:
 *                   type: integer
 *                   description: The ID of the SubComponent.
 *                   example: 10
 *                 subcomponents_name:
 *                   type: string
 *                   description: The name of the SubComponent.
 *                   example: "GPU 05"
 *                 component_id:
 *                   type: integer
 *                   description: The ID of the parent Component.
 *                   example: 2
 *       404:
 *         description: SubComponent name not found or missing in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubComponent name not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.post('/by-name', getSubComponentsByName);

/**
 * @swagger
 * /api/v1/SubComponents/{id}:
 *   put:
 *     summary: Update multiple SubComponents by ID
 *     tags: [SubComponents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the SubComponent to update.
 *         schema:
 *           type: integer
 *           example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array  # Ensures input is an array
 *             items:
 *               type: object
 *               properties:
 *                 component_id:
 *                   type: string
 *                   description: The ID of the parent Component.
 *                   example: "2"
 *                 subcomponents_name:
 *                   type: string
 *                   description: The name of the SubComponent.
 *                   example: "Updated GPU"
 *     responses:
 *       200:
 *         description: SubComponents updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subComponents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subcomponents_id:
 *                         type: integer
 *                         description: The ID of the updated SubComponent.
 *                         example: 10
 *                       component_id:
 *                         type: integer
 *                         description: The parent Component ID.
 *                         example: 2
 *                       subcomponents_name:
 *                         type: string
 *                         description: The updated name of the SubComponent.
 *                         example: "Updated GPU"
 *       400:
 *         description: Bad request. Expected an array but received an object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expected array, received object"
 *       404:
 *         description: Not Found. The SubComponent with the given ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubComponent not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "An unexpected error occurred."
 */
router.put('/:id', updateSubComponents);

/**
 * @swagger
 * /api/v1/SubComponents/{id}:
 *   delete:
 *     summary: Permanently delete a SubComponent by ID
 *     tags: [SubComponents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the SubComponent to delete.
 *         schema:
 *           type: string
 *           example: "10"
 *     responses:
 *       200:
 *         description: SubComponent deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubComponent deleted successfully"
 *       404:
 *         description: SubComponent not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sub Components not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.delete('/:id', deleteSubComponent);

/**
 * @swagger
 * /api/v1/SubComponents/{id}/soft-delete:
 *   delete:
 *     summary: Soft delete a SubComponent by ID
 *     tags: [SubComponents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the SubComponent to soft delete.
 *         schema:
 *           type: string
 *           example: "10"
 *     responses:
 *       200:
 *         description: SubComponent successfully soft deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted_at:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the SubComponent was marked as deleted.
 *                   example: "2025-02-07T12:30:45.123Z"
 *                 is_deleted:
 *                   type: boolean
 *                   description: Status indicating if the SubComponent is soft deleted.
 *                   example: true
 *       404:
 *         description: SubComponent not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubComponent not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.delete('/:id/soft-delete', softDeleteSubComponents);

/**
 * @swagger
 * /api/v1/SubComponents/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted SubComponent by ID
 *     tags: [SubComponents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the SubComponent to restore.
 *         schema:
 *           type: string
 *           example: "10"
 *     responses:
 *       200:
 *         description: SubComponent successfully restored.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubComponent restored successfully"
 *       404:
 *         description: SubComponent not found or not deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "SubComponent not found or not deleted"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.patch('/:id/restore', restoreSubComponent);

module.exports = router;