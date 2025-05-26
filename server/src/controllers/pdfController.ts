import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import pool from '../db';

/**
 * Exports test questions to PDF without showing correct or user-selected answers.
 * Adds test ID on the first page.
 * Supports Cyrillic characters using embedded font.
 *
 * @route POST /api/export-pdf
 * @param {Array} questions - Array of questions (must contain `question`, `options`, `correct_answer` fields)
 * @param {number|string} testId - ID of the test to display in PDF
 * @returns PDF file as response
 */
export const exportPDF = async (req: Request, res: Response) => {
  const { questions, testId } = req.body;

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
  const fontPath = path.join(__dirname, '../../fonts/DejaVuSans.ttf');
  if (fs.existsSync(fontPath)) {
    doc.font(fontPath);
  } else {
    doc.font('Helvetica');
  }

  // Write Test ID header
  doc.fontSize(16).text(`Test ID: ${testId}`, { align: 'left' });
  doc.moveDown(2);

  // Title
  doc.fontSize(18).text('Test Questions', { align: 'center' }).moveDown(2);

  // Write questions only
  questions.forEach((q: any, idx: number) => {
    doc.fontSize(14).text(`${idx + 1}. ${q.question}`);

    Object.entries(q.options).forEach(([k, v]) => {
      doc.fontSize(12).text(`   ${k}. ${v}`);
    });

    doc.moveDown(1);
  });

  doc.end();
};

export const exportPDFByTestId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM tests WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }
    const test = result.rows[0];
    const questions = test.questions;

    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    const filename = `test_${id}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    const fontPath = path.join(__dirname, '../../fonts/DejaVuSans.ttf');
    if (fs.existsSync(fontPath)) {
      doc.font(fontPath);
    } else {
      doc.font('Helvetica');
    }

    doc.fontSize(16).text(`Test ID: ${id}`, { align: 'left' });
    doc.moveDown(2);

    doc.fontSize(18).text('Test Questions', { align: 'center' }).moveDown(2);

    questions.forEach((q: any, idx: number) => {
      doc.fontSize(14).text(`${idx + 1}. ${q.question}`);
      Object.entries(q.options).forEach(([k, v]) => {
        doc.fontSize(12).text(`   ${k}. ${v}`);
      });
      doc.moveDown(1);
    });

    doc.end();

  } catch (err: any) {
    console.error('Error in exportPDFByTestId:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
