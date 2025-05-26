const API_URL = import.meta.env.VITE_API_URL;

import type { Test, TestMeta } from '../types';

/**
 * Generates a new test via backend API.
 * @param meta Test meta info
 * @param count Number of questions
 * @returns Object with array of tests and testId
 * @throws Error if backend call fails
 */
export const generateTests = async (
  meta: TestMeta,
  count: number
): Promise<{ tests: Test[]; testId: number }> => {
  const res = await fetch(`${API_URL}/generate-tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...meta, count }),
  });
  if (!res.ok) {
    let errorText = 'Failed to generate tests';
    try {
      const data = await res.json();
      if (data?.error) errorText = data.error;
    } catch {/* ignore */}
    throw new Error(errorText);
  }
  const data = await res.json();
  // Server wraps response in { success, data }
  return { tests: data.data.tests, testId: data.data.testId };
};

/**
 * Checks user answers via backend API.
 * @param testId Test ID
 * @param userAnswers Array of selected answers
 * @returns Object with score and mistakes
 * @throws Error if backend call fails
 */
export const checkAnswers = async (
  testId: number, userAnswers: string[]
): Promise<{ score: number; mistakes: any[] }> => {
  const res = await fetch(`${API_URL}/check-answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ testId, userAnswers }),
  });
  if (!res.ok) {
    let errorText = 'Failed to check answers';
    try {
      const data = await res.json();
      if (data?.error) errorText = data.error;
    } catch {/* ignore */}
    throw new Error(errorText);
  }
  const data = await res.json();
  // Server wraps response in { success, data }
  return data.data;
};

/**
 * Exports test and user answers as a PDF via backend API.
 * @param questions Array of questions
 * @param answers Array of user answers
 * @param testId Test ID (required by backend)
 * @returns PDF file as Blob
 * @throws Error if backend call fails
 */
export const exportPdf = async (
  questions: Test[],
  answers: string[] | null,
  testId: number | string
): Promise<Blob> => {
  const res = await fetch(`${API_URL}/export-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questions, answers, testId }),
  });
  if (!res.ok) throw new Error('Failed to export PDF');
  return res.blob();
};

/**
 * Downloads a PDF for a test by its ID from the backend.
 * @param testId Test ID
 * @returns PDF file as Blob
 * @throws Error if backend call fails
 */
export const exportPdfByTestId = async (testId: number | string): Promise<Blob> => {
  const res = await fetch(`${API_URL}/export-pdf/${testId}`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Failed to export PDF by ID');
  return res.blob();
};
