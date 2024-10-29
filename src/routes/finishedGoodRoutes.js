const express = require('express');
const {getFinishedGoodsData } = require('../controllers/rawMaterialController');

const router = express.Router();

router.get('/finished-goods', getFinishedGoodsData);

module.exports = router;
