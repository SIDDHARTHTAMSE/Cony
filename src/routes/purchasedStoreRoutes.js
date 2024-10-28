// routes/purchaseRoutes.js
const express = require('express');
const {createPurchaseStore, getAllPurchaseStores, getPurchaseStoreById, updatePurchaseStore, deletePurchaseStore} = require('../controllers/purchasedStoreController')

const router = express.Router();

router.post('/purchase_store',createPurchaseStore);
router.get('/purchase_store', getAllPurchaseStores);
router.get('/purchase_store/:id', getPurchaseStoreById);
router.put('/purchase_store/:id', updatePurchaseStore);
router.delete('/purchase_store/:id', deletePurchaseStore);

module.exports = router;
