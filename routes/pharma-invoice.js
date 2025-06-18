const express = require('express');
const router = express.Router();
const pharmaDefaultInvoiceController = require('../controllers/pharma-invoice');

router.get('/export', pharmaDefaultInvoiceController.pharmaInvoice);

module.exports = router;
