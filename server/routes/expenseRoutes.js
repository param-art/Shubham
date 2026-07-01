const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/', expenseController.addExpense);
router.get('/', expenseController.getExpensesByDate);
router.get('/daily-report', expenseController.getDailyExpenseReport);
router.get('/monthly-report', expenseController.getMonthlyExpenseReport);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
