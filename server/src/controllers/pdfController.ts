import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';

export const exportPDF = (req: Request, res: Response) => {
  const { questions, answers } = req.body;

  const doc = new PDFDocument();
  let filename = "test.pdf";
  res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);

  doc.fontSize(18).text('Тестові питання', { align: 'center' }).moveDown(2);

  questions.forEach((q: any, idx: number) => {
    doc.fontSize(14).text(`${idx + 1}. ${q.question}`);
    Object.entries(q.options).forEach(([k, v]) => {
      let mark = answers && answers[idx] === k ? ' (Ваша відповідь)' : '';
      doc.fontSize(12).text(`   ${k}. ${v}${mark}`);
    });
    if (q.correct_answer)
      doc.fontSize(10).fillColor('green').text(`   Правильна відповідь: ${q.correct_answer}`).fillColor('black');
    doc.moveDown(1);
  });

  doc.end();
};