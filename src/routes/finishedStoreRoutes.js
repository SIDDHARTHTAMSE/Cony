const express = require('express');
const {
  createFinishedStore,
  getAllFinishedStores,
  getFinishedStoreById,
  updateFinishedStore,
  deleteFinishedStore,
} = require('../controllers/finishedStoreController'); // Adjust the path as necessary

const router = express.Router();

router.post('/', createFinishedStore);
router.get('/', getAllFinishedStores);
router.get('/:id', getFinishedStoreById);
router.put('/:id', updateFinishedStore);
router.delete('/:id', deleteFinishedStore);

module.exports = router;
