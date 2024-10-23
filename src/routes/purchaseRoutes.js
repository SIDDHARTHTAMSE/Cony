// routes/purchaseRoutes.js
const express = require('express');
const purchaseController = require('../controllers/purchaseController');

const router = express.Router();

router.post('/purchases', purchaseController.createPurchase);
router.get('/purchases', purchaseController.getPurchases);
router.get('/purchases/:id', purchaseController.getPurchaseById);
router.put('/purchases/:id', purchaseController.updatePurchase);
router.delete('/purchases/:id', purchaseController.deletePurchase);

module.exports = router;
