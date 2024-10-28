const express = require('express');
const {
  createFinishedStore,
  getAllFinishedStores,
  getFinishedStoreById,
  updateFinishedStore,
  deleteFinishedStore,
} = require('../controllers/finishedStoreController'); // Adjust the path as necessary

const router = express.Router();

router.post('/finished-stores', createFinishedStore);
router.get('/finished-stores', getAllFinishedStores);
router.get('/finished-stores/:id', getFinishedStoreById);
router.put('/finished-stores/:id', updateFinishedStore);
router.delete('/finished-stores/:id', deleteFinishedStore);

module.exports = router;
