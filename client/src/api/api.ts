const API_URL = import.meta.env.VITE_API_URL;

import type { Test } from '../types';

export const generateTests = async (
  subject: string, topic: string, grade: string, count: number
): Promise<Test[]> => {
  const res = await fetch(`${API_URL}/generate-tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject, topic, grade, count }),
  });
  if (!res.ok) throw new Error('Failed to generate tests');
  const data = await res.json();
  return data.tests;
};

export const checkAnswers = async (
  testId: number, userAnswers: string[]
): Promise<{ score: number; mistakes: any[] }> => {
  const res = await fetch(`${API_URL}/check-answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ testId, userAnswers }),
  });
  if (!res.ok) throw new Error('Failed to check answers');
  return res.json();
};

export const exportPdf = async (questions: Test[], answers: string[] | null): Promise<Blob> => {
  const res = await fetch(`${API_URL}/export-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questions, answers }),
  });
  if (!res.ok) throw new Error('Failed to export PDF');
  return res.blob();
};
