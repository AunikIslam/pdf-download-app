const express = require('express');
const router = express.Router();
const pdfExportController = require('../controllers/pdf-export-controller');

router.get('/secondary-order-details/:orderId', pdfExportController.exportSecondaryOrderDetails);

router.get('/secondary-order-summary-for-rtm', pdfExportController.secondaryOrderSummaryForRtm);

/**
 * @swagger
 * /pdf-export/api/v1/get-marketIds/{organizationId}/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [pdf-export-controller]
 *     operationId: users
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: hasMarketLevel
 *         required: true
 *         schema:
 *           type: boolean
 *       - in: path
 *         name: activeOnly
 *         required: true
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/UserResponse'
 */
router.get('/api/v1/get-marketIds/:organizationId/:userId', pdfExportController.getUserMarketIds);


module.exports = router;