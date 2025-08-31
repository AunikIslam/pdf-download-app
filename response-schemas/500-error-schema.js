/**
 * @swagger
 * components:
 *  schemas:
 *     ErrorResponse500:
 *       type: object
 *       properties:
 *          status:
 *              type: integer
 *              description: HTTP status code
 *              example: 500
 *          error:
 *              type: string
 *              description: Single error message (when only one error occurs)
 *              example: 'Internal Server Error'
 *          errors:
 *              type: array
 *              description: Multiple error messages (when more than one error occurs)
 *              items:
 *                  type: string
 *              example:
 *                  - "Internal Server Error"
 *          timestamp:
 *              type: string
 *              format: date-time
 *              description: when the error occurred
 *              example: "2025-08-30 10:15:30"
 */