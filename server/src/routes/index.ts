import { Router } from "express";
import * as testsController from "../controllers/testsController";
import * as pdfController from "../controllers/pdfController";

const router = Router();

router.post('/generate-tests', testsController.generateTests);
router.post('/check-answers', testsController.checkAnswers);
router.post('/export-pdf', pdfController.exportPDF);

export default router;