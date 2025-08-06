const express = require('express');
const router = express.Router();
const pdfExportController = require('../controllers/pdf-export-controller');

router.get('/secondary-order-details/:orderId', pdfExportController.exportSecondaryOrderDetails);

router.get('/secondary-order-summary-for-rtm', pdfExportController.secondaryOrderSummaryForRtm);

/**
 * @swagger
 * /pdf-export/api/v1/get-marketIds:
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
 *              "organizationId": 0,
 *              "userId": 0,
 *              "fromDate": "2025-05-01",
 *              "toDate": "2025-08-06",
 *              "approveFilter": "string",
 *              "marketIds": []
 *           }
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/UserResponse'
 */
router.get('/api/v1/get-marketIds', pdfExportController.getUserMarketIds);


module.exports = router;