const express = require('express');
const { createItem, getAllItems  } = require('../controllers/inventory');

const router = express.Router();

// Define routes for products
router.post('/', createItem);
router.get('/', getAllItems);

module.exports = router;
