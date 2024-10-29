const express = require('express');
const {getInventoryData } = require('../controllers/finishedGoodController');

const router = express.Router();

router.get('/inventory', getInventoryData);

module.exports = router;
