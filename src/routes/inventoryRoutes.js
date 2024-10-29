const express = require('express');
const {getFinishedGoodsData, getRawMaterialInventoryData } = require('../controllers/inventoryManagementController.js');

const router = express.Router();

router.get('/raw-materials', getRawMaterialInventoryData);
router.get('/finished-goods', getFinishedGoodsData);

module.exports = router;
