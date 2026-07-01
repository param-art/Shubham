const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.post('/', purchaseController.addPurchase);
router.get('/', purchaseController.getPurchasesByDate);
router.get('/supplier', purchaseController.getPurchasesBySupplier);
router.get('/daily-report', purchaseController.getDailyPurchaseReport);
router.get('/monthly-report', purchaseController.getMonthlyPurchaseReport);
router.put('/:id', purchaseController.updatePurchase);
router.delete('/:id', purchaseController.deletePurchase);

module.exports = router;
