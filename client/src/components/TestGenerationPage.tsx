import React, { useState } from 'react';
import type { Test, TestMeta } from '../types';
import { TestGenerator } from './TestGenerator';
import { TestList } from './TestList';
import { TestChecker } from './TestChecker';
import { PdfExportButton } from './PdfExportButton';
import { checkAnswers } from '../api/api';

/**
 * TestGenerationPage - allows users to generate, take, and check tests.
 */
const TestGenerationPage: React.FC = () => {
  const [testId, setTestId] = useState<number | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [testMeta, setTestMeta] = useState<TestMeta | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<{ score: number; mistakes: any[] } | null>(null);
  const [checking, setChecking] = useState(false);

  /**
   * Called after successful test generation.
   */
  const handleTestsGenerated = (
    generated: Test[],
    meta: TestMeta,
    id: number
  ) => {
    setTests(generated);
    setTestMeta(meta);
    setTestId(id);
    setUserAnswers(Array(generated.length).fill(''));
    setResult(null);
  };

  /**
   * Updates user's answer for a specific question.
   */
  const handleAnswer = (idx: number, value: string) => {
    setUserAnswers(ans => {
      const newAns = [...ans];
      newAns[idx] = value;
      return newAns;
    });
  };

  /**
   * Submits user's answers for checking.
   */
  const handleCheck = async () => {
    if (userAnswers.some(ans => !ans)) {
      alert('Please answer all questions!');
      return;
    }
    if (!testId) {
      alert('Test ID is missing!');
      return;
    }
    setChecking(true);
    try {
      const res = await checkAnswers(testId, userAnswers);
      setResult(res);
    } catch (e: any) {
      alert(e.message || "Failed to check the test");
    }
    setChecking(false);
  };

  /**
   * Calculates grading in percent, 5-point, and 12-point systems.
   */
  const getGrades = () => {
    if (!tests.length || !result) return null;
    const percent = Math.round((result.score / tests.length) * 100);

    const grade5 =
      percent >= 90 ? 5 :
      percent >= 70 ? 4 :
      percent >= 50 ? 3 : 2;

    const grade12 =
      percent >= 90 ? 12 :
      percent >= 75 ? 10 :
      percent >= 60 ? 8 :
      percent >= 40 ? 6 : 3;

    return { percent, grade5, grade12 };
  };

  const grades = getGrades();

  return (
    <div style={{ maxWidth: 650, margin: '0 auto', padding: 24 }}>
      <h1>Test Generator</h1>
      <TestGenerator onTestsGenerated={handleTestsGenerated} />
      {testMeta && (
        <div style={{ margin: "8px 0", color: "#666" }}>
          <b>Subject:</b> {testMeta.subject} | <b>Topic:</b> {testMeta.topic}
          {testMeta.description && (
            <> | <b>Description:</b> {testMeta.description}</>
          )}
          {testMeta.grade && <> | <b>Grade/Level:</b> {testMeta.grade}</>}
          {testMeta.difficulty && <> | <b>Difficulty:</b> {testMeta.difficulty}</>}
        </div>
      )}
      {tests.length > 0 && (
        <>
          <TestList tests={tests} userAnswers={userAnswers} onAnswer={handleAnswer} />
          {!result && (
            <button onClick={handleCheck} disabled={checking} style={{ marginTop: 12 }}>
              {checking ? "Checking..." : "Check"}
            </button>
          )}
          <PdfExportButton questions={tests} answers={userAnswers} testId={testId!} />
          {result && (
            <div>
              <TestChecker score={result.score} mistakes={result.mistakes} />
              {grades && (
                <div style={{ marginTop: 16 }}>
                  <b>Percent:</b> {grades.percent}%<br />
                  <b>Grade (5-point):</b> {grades.grade5}<br />
                  <b>Grade (12-point):</b> {grades.grade12}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TestGenerationPage;
