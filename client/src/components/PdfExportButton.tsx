import React from 'react';
import { exportPdf } from '../api/api';
import type { Test } from '../types';

interface PdfExportButtonProps {
  questions: Test[];
  answers: string[];
}

export const PdfExportButton: React.FC<PdfExportButtonProps> = ({ questions, answers }) => {
  const handleExport = async () => {
    try {
      const blob = await exportPdf(questions, answers);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tests.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || "Не вдалося експортувати PDF");
    }
  };

  return <button onClick={handleExport} style={{ marginTop: 12 }}>Експортувати у PDF</button>;
};
