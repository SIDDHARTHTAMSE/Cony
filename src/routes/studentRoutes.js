const express = require("express");
const { createStudent } = require("../controllers/studentController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API for managing students
 */

/**
 * @swagger
 * /api/v1/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_name:
 *                 type: string
 *                 example: "John Doe"
 *               gender:
 *                 type: string
 *                 example: "Male"
 *               roll_no:
 *                 type: integer
 *                 example: 12345
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", createStudent);

module.exports = router;
