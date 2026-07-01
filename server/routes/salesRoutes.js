const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.post('/', saleController.addSale);
router.get('/', saleController.getSalesByDate);
router.get('/id/:id', saleController.getSaleById);
router.get('/daily-report', saleController.getDailySalesReport);
router.get('/monthly-report', saleController.getMonthlySalesReport);
router.put('/:id', saleController.updateSale);
router.delete('/:id', saleController.deleteSale);

module.exports = router;
