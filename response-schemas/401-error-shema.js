/**
 * @swagger
 * components:
 *  schemas:
 *     ErrorResponse401:
 *       type: object
 *       properties:
 *          status:
 *              type: integer
 *              description: HTTP status code
 *              example: 401
 *          error:
 *              type: string
 *              description: Single error message (when only one error occurs)
 *              example: ' Request failed with status code 401'
 *          errors:
 *              type: array
 *              description: Multiple error messages (when more than one error occurs)
 *              items:
 *                  type: string
 *              example:
 *                  - " Request failed with status code 401"
 *          timestamp:
 *              type: string
 *              format: date-time
 *              description: when the error occurred
 *              example: "2025-08-30 10:15:30"
 */