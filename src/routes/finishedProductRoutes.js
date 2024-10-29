const express = require('express');
const { createFinishedProduct, getAllFinishedProducts, getFinishedProductById, updateFinishedProduct, deleteFinishedProduct } = require('../controllers/finishedProductController');

const router = express.Router();

router.post('/', createFinishedProduct);
router.get('/', getAllFinishedProducts);
router.get('/:id', getFinishedProductById);
router.put('/:id', updateFinishedProduct);
router.delete('/:id', deleteFinishedProduct);

module.exports = router;
