// routes/purchaseRoutes.js
const express = require('express');
const {createPurchaseStore, getAllPurchaseStores, getPurchaseStoreById, updatePurchaseStore, deletePurchaseStore} = require('../controllers/purchasedStoreController')

const router = express.Router();

router.post('/',createPurchaseStore);
router.get('/', getAllPurchaseStores);
router.get('/:id', getPurchaseStoreById);
router.put('/:id', updatePurchaseStore);
router.delete('/:id', deletePurchaseStore);

module.exports = router;
