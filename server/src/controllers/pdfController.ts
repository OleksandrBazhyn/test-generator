import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';

/**
 * Exports test questions and answers to PDF, without showing correct answers.
 *
 * @route POST /api/export-pdf
 * @param {Array} questions - Array of questions (must contain `question`, `options`, `correct_answer` fields)
 * @param {Array} [answers] - Array of user answers (optional, to highlight user's selection)
 * @returns PDF file as response
 */
export const exportPDF = async (req: Request, res: Response) => {  // <-- async!
  const { questions, answers } = req.body;

  // Validate input
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Questions array is required and cannot be empty.' });
  }

  for (const q of questions) {
    if (
      typeof q.question !== 'string' ||
      typeof q.options !== 'object' ||
      !['A', 'B', 'C', 'D'].every(opt => typeof q.options[opt] === 'string')
    ) {
      return res.status(400).json({ error: 'Each question must have question:string and options:A/B/C/D:string.' });
    }
  }

  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  const filename = "test.pdf";
  res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);

  doc.fontSize(18).text('Test Questions', { align: 'center' }).moveDown(2);

  questions.forEach((q: any, idx: number) => {
    doc.fontSize(14).text(`${idx + 1}. ${q.question}`);

    Object.entries(q.options).forEach(([k, v]) => {
      let mark = (answers && answers[idx] === k) ? ' (Your answer)' : '';
      doc.fontSize(12).text(`   ${k}. ${v}${mark}`);
    });

    // Do not display correct answer in the PDF.
    doc.moveDown(1);
  });

  doc.end();
};
