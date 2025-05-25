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
 * @route GET /api/tests/:id
 * @desc Get a test by its ID
 */
router.get('/tests/:id', asyncHandler(getTestById));

/**
 * @route POST /api/generate-tests
 * @desc Generate a new test and save to database
 */
router.post('/generate-tests', asyncHandler(generateTests));

/**
 * @route POST /api/check-answers
 * @desc Check user's answers for a given test
 */
router.post('/check-answers', asyncHandler(checkAnswers));

/**
 * @route POST /api/export-pdf
 * @desc Export questions and answers to PDF
 */
router.post('/export-pdf', asyncHandler(exportPDF));

export default router;
