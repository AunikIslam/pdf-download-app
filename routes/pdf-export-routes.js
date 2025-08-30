const express = require('express');
const router = express.Router();
const pdfExportController = require('../controllers/pdf-export-controller');

router.get('/secondary-order-details/:orderId', pdfExportController.exportSecondaryOrderDetails);

router.get('/secondary-order-summary-for-rtm', pdfExportController.secondaryOrderSummaryForRtm);

/**
 * @swagger
 * /pdf-export/api/v1/get-secondary-order-pdf-for-afm:
 *   get:
 *     summary: Get user by ID
 *     tags: [pdf-export-controller]
 *     operationId: users
 *     parameters:
 *       - in: query
 *         name: request
 *         required: true
 *         schema:
 *           type: object
 *         example: |
 *           {
 *              "guid": "string",
 *              "fromDate": "2025-07-15",
 *              "toDate": "2025-08-06",
 *              "retailerId": 0,
 *              "distributorId": 0,
 *              "approveFilter": "string",
 *              "marketIds": []
 *           }
 *     responses:
 *       200:
 *         description: PDF File Downloaded
 *         content:
 *             application/pdf:
 *                  schema:
 *                      type: string
 *                      format: binary
 */
router.get('/api/v1/get-secondary-order-pdf-for-afm', pdfExportController.secondaryOrderSummaryForAfm);


module.exports = router;