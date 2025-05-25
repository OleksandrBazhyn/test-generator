import { Router, Request, Response, NextFunction } from "express";
import {
  generateTests,
  getTestById,
  checkAnswers
} from "../controllers/testsController";
import { exportPDF } from "../controllers/pdfController";

/**
 * Wraps async route handlers and forwards errors to Express error middleware.
 * @param fn Async request handler
 */
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

const router = Router();

/**
 * @openapi
 * /tests/{id}:
 *   get:
 *     summary: Get a test by its ID
 *     tags:
 *       - Tests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Test ID
 *     responses:
 *       200:
 *         description: Test found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Test'
 *       404:
 *         description: Test not found
 */
router.get('/tests/:id', asyncHandler(getTestById));

/**
 * @openapi
 * /generate-tests:
 *   post:
 *     summary: Generate a new test and save to database
 *     tags:
 *       - Tests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               topic:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               grade:
 *                 type: string
 *               count:
 *                 type: integer
 *             required:
 *               - subject
 *               - topic
 *               - count
 *     responses:
 *       200:
 *         description: Test generated and saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     tests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Test'
 *                     testId:
 *                       type: integer
 *       400:
 *         description: Invalid input
 */
router.post('/generate-tests', asyncHandler(generateTests));

/**
 * @openapi
 * /check-answers:
 *   post:
 *     summary: Check user's answers for a given test
 *     tags:
 *       - Tests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testId:
 *                 type: integer
 *               userAnswers:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - testId
 *               - userAnswers
 *     responses:
 *       200:
 *         description: Answers checked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: integer
 *                     mistakes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           question:
 *                             type: string
 *                           correct:
 *                             type: string
 *                           your:
 *                             type: string
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Test not found
 */
router.post('/check-answers', asyncHandler(checkAnswers));

/**
 * @openapi
 * /export-pdf:
 *   post:
 *     summary: Export questions and answers to PDF
 *     tags:
 *       - PDF
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Test'
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid input
 */
router.post('/export-pdf', asyncHandler(exportPDF));

export default router;
