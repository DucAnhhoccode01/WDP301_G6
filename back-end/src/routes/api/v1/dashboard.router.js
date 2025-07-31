const express = require('express');
const router = express.Router();
const DashboardController = require('../../../controllers/dashboard.controller');

router.get('/top-selling', DashboardController.getTopSellingProducts);
router.get('/unsold', DashboardController.getUnsoldProducts);
router.get('/expired', DashboardController.getExpiredProducts);
router.get('/revenue', DashboardController.getTotalRevenue);
router.get('/monthly-revenue', DashboardController.getMonthlyRevenue);

module.exports = router;
