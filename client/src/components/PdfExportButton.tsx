import React from 'react';
import { exportPdf } from '../api/api';
import type { Test } from '../types';

interface PdfExportButtonProps {
  questions: Test[];
  answers: string[];
  testId: number | string;
}

/**
 * PdfExportButton - exports questions and user's answers to PDF via backend.
 */
export const PdfExportButton: React.FC<PdfExportButtonProps> = ({ questions, answers, testId }) => {
  const handleExport = async () => {
    try {
      if (!questions?.length) {
        alert('No questions to export!');
        return;
      }
      const blob = await exportPdf(questions, answers, testId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `test_${testId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err?.message || "Could not export PDF");
    }
  };

  return (
    <button onClick={handleExport} style={{ marginTop: 12 }}>
      Export to PDF
    </button>
  );
};
