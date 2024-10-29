// routes/purchaseRoutes.js
const express = require('express');
const purchaseController = require('../controllers/purchaseController');

const router = express.Router();

router.post('/', purchaseController.createPurchase);
router.get('/', purchaseController.getPurchases);
router.get('/:id', purchaseController.getPurchaseById);
router.put('/:id', purchaseController.updatePurchase);
router.delete('/:id', purchaseController.deletePurchase);

module.exports = router;
