const express = require('express');
const router = express.Router();
const pdfExportController = require('../controllers/pdf-export-controller');

router.get('/secondary-order-details/:orderId', pdfExportController.exportSecondaryOrderDetails);

module.exports = router;