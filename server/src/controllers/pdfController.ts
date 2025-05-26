import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Exports test questions and answers to PDF, without showing correct answers.
 * Adds test ID on the first page.
 * Supports Cyrillic characters using embedded font.
 *
 * @route POST /api/export-pdf
 * @param {Array} questions - Array of questions (must contain `question`, `options`, `correct_answer` fields)
 * @param {Array} [answers] - Array of user answers (optional, to highlight user's selection)
 * @param {number|string} testId - ID of the test to display in PDF
 * @returns PDF file as response
 */
export const exportPDF = async (req: Request, res: Response) => {
  const { questions, answers, testId } = req.body;

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
  if (!testId) {
    return res.status(400).json({ error: 'testId is required.' });
  }

  // Create PDF document
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  // Set headers
  const filename = `test_${testId}.pdf`;
  res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');

  // Pipe PDF to response
  doc.pipe(res);

  // Register a font that supports Cyrillic
  // You can put a .ttf file with Cyrillic support in your project (e.g. ./fonts/DejaVuSans.ttf)
  const fontPath = path.join(__dirname, '../../fonts/DejaVuSans.ttf');
  if (fs.existsSync(fontPath)) {
    doc.font(fontPath);
  } else {
    // Fallback to built-in Helvetica (may not support Cyrillic correctly)
    doc.font('Helvetica');
  }

  // Write Test ID header
  doc.fontSize(16).text(`Test ID: ${testId}`, { align: 'left' });
  doc.moveDown(2);

  // Title
  doc.fontSize(18).text('Test Questions', { align: 'center' }).moveDown(2);

  // Write questions and user answers (without correct answers)
  questions.forEach((q: any, idx: number) => {
    doc.fontSize(14).text(`${idx + 1}. ${q.question}`);

    Object.entries(q.options).forEach(([k, v]) => {
      const mark = (answers && answers[idx] === k) ? ' (Your answer)' : '';
      doc.fontSize(12).text(`   ${k}. ${v}${mark}`);
    });

    doc.moveDown(1);
  });

  doc.end();
};
