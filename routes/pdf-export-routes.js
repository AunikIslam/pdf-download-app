const express = require('express');
const router = express.Router();
const pdfExportController = require('../controllers/pdf-export-controller');

router.get('/secondary-order-details/:orderId', pdfExportController.exportSecondaryOrderDetails);

router.get('/secondary-order-summary-for-rtm', pdfExportController.secondaryOrderSummaryForRtm);

/**
 * @swagger
 * /get-marketIds:
 *   get:
 *     summary: Get user by ID
 *     tags: [pdfExportController]
 *     operationId: users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/UserResponse'
 */
router.get('/get-marketIds', pdfExportController.getUserMarketIds);


module.exports = router;