import { Router } from "express";
import * as testsController from "../controllers/testsController";
import * as pdfController from "../controllers/pdfController";

const router = Router();

function asyncHandler(fn: any) {
	return function(req: any, res: any, next: any) {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

router.get('/tests/:id', asyncHandler(testsController.getTestById));
router.post('/generate-tests', asyncHandler(testsController.generateTests));
router.post('/check-answers', asyncHandler(testsController.checkAnswers));
router.post('/export-pdf', asyncHandler(pdfController.exportPDF));

export default router;