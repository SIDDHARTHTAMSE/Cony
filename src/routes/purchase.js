const express = require('express');
const {createPurchase} = require('../controllers/createPurchase');

const router = express.Router();

// Define routes for purchase products

// 1.1 to create new purchase 
router.post('/', createPurchase);

module.exports = router;
