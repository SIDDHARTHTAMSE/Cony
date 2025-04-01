const express = require('express');
const { 
    createVendor, 
    getAllVendors, 
    getVendorById, 
    updateVendorById, 
    deleteVendor 
} = require('../controllers/vendorController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: API for managing vendors
 */

/**
 * @swagger
 * /api/v1/vendors:
 *   post:
 *     summary: Create a new vendor
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vendor_name:
 *                 type: string
 *                 example: "Tech Supplies Inc."
 *               address:
 *                 type: string
 *                 example: "123 Main Street, NY, USA"
 *               country:
 *                 type: string
 *                 example: "USA"
 *               contact_details:
 *                 type: string
 *                 example: "9876543210"
 *               email_id:
 *                 type: string
 *                 example: "vendor@example.com"
 *     responses:
 *       201:
 *         description: Vendor created successfully
 *       400:
 *         description: Bad Request (Validation failed)
 */
router.post('/', createVendor);

/**
 * @swagger
 * /api/v1/vendors:
 *   get:
 *     summary: Get all vendors
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: A list of vendors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   vendor_id:
 *                     type: integer
 *                     example: 1
 *                   vendor_name:
 *                     type: string
 *                     example: "Siddharth"
 *                   address:
 *                     type: string
 *                     example: "Goa, India"
 *                   country:
 *                     type: string
 *                     example: "India"
 *                   contact_details:
 *                     type: string
 *                     example: "9876543210"
 *                   email_id:
 *                     type: string
 *                     example: "Sid@example.com"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-31T07:05:41.717Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-31T07:05:41.717Z"
 */
router.get('/', getAllVendors);

/**
 * @swagger
 * /api/v1/vendors/{id}:
 *   get:
 *     summary: Get a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vendor ID
 *     responses:
 *       200:
 *         description: Vendor details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vendor_id:
 *                   type: integer
 *                   example: 1
 *                 vendor_name:
 *                   type: string
 *                   example: "Siddharth"
 *                 address:
 *                   type: string
 *                   example: "Goa, India"
 *                 country:
 *                   type: string
 *                   example: "India"
 *                 contact_details:
 *                   type: string
 *                   example: "9876543210"
 *                 email_id:
 *                   type: string
 *                   example: "Sid@example.com"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-31T07:05:41.717Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-31T07:05:41.717Z"
 *       404:
 *         description: Vendor not found
 */
router.get('/:id', getVendorById);

/**
 * @swagger
 * /api/v1/vendors/{id}:
 *   put:
 *     summary: Update a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vendor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vendor_name:
 *                 type: string
 *                 example: "New Vendor Name"
 *               address:
 *                 type: string
 *                 example: "New Address"
 *               country:
 *                 type: string
 *                 example: "New Country"
 *               contact_details:
 *                 type: string
 *                 example: "9998887776"
 *               email_id:
 *                 type: string
 *                 example: "newemail@example.com"
 *     responses:
 *       200:
 *         description: Vendor updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Vendor not found
 */
router.put('/:id', updateVendorById);

/**
 * @swagger
 * /api/v1/vendors/{id}:
 *   delete:
 *     summary: Delete a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vendor ID
 *     responses:
 *       200:
 *         description: Vendor deleted successfully
 *       404:
 *         description: Vendor not found
 */
router.delete('/:id', deleteVendor);

module.exports = router;
