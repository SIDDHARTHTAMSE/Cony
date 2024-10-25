const express = require('express');
const { createFinishedProduct, getAllFinishedProducts, getFinishedProductById, updateFinishedProduct, deleteFinishedProduct } = require('../controllers/finishedProductController');

const router = express.Router();

router.post('/finished-products', createFinishedProduct);
router.get('/finished-products', getAllFinishedProducts);
router.get('/finished-products/:id', getFinishedProductById);
router.put('/finished-products/:id', updateFinishedProduct);
router.delete('/finished-products/:id', deleteFinishedProduct);

module.exports = router;
