const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/comprehensive', reportController.getComprehensiveReport);
router.get('/dashboard', reportController.getDashboardData);

module.exports = router;
