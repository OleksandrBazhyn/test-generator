import React, { useState } from 'react';
import { checkAnswers } from '../api/api';

/**
 * ResultsPage - allows user to check their test results by test ID and answers.
 */
const ResultsPage: React.FC = () => {
  const [testId, setTestId] = useState('');
  const [answers, setAnswers] = useState('');
  const [result, setResult] = useState<{ score: number; mistakes: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles form submission and answer check.
   */
  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testId || !answers) {
      alert('Please enter test ID and answers');
      return;
    }
    // Parse answers (split, trim, uppercase)
    const userAnswers = answers
      .split(',')
      .map(a => a.trim().toUpperCase())
      .filter(Boolean);

    if (!userAnswers.length) {
      alert('Please enter at least one answer');
      return;
    }

    setLoading(true);
    try {
      const res = await checkAnswers(Number(testId), userAnswers);
      setResult(res);
    } catch (e: any) {
      alert(e.message || 'Failed to check answers');
      setResult(null);
    }
    setLoading(false);
  };

  /**
   * Calculates grading in percent, 5-grade, and 12-grade systems.
   */
  const getGrades = () => {
    if (!result) return null;
    const total = result.score + result.mistakes.length;
    if (!total) return null;
    const percent = Math.round((result.score / total) * 100);
    let grade5 = 2;
    if (percent >= 90) grade5 = 5;
    else if (percent >= 70) grade5 = 4;
    else if (percent >= 50) grade5 = 3;
    let grade12 = 3;
    if (percent >= 90) grade12 = 12;
    else if (percent >= 75) grade12 = 10;
    else if (percent >= 60) grade12 = 8;
    else if (percent >= 40) grade12 = 6;
    return { percent, grade5, grade12 };
  };

  const grades = getGrades();

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h2>Check Test by ID</h2>
      <form onSubmit={handleCheck} style={{ marginBottom: 24 }}>
        <input
          type="number"
          placeholder="Test ID"
          value={testId}
          onChange={e => setTestId(e.target.value)}
          required
          min={1}
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Answers (e.g.: A,B,C,D,A)"
          value={answers}
          onChange={e => setAnswers(e.target.value)}
          required
          style={{ width: 220, marginRight: 8 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>
      {result && (
        <div>
          <h3>Result</h3>
          <p>Your score: {result.score}</p>
          {grades && (
            <div style={{ marginBottom: 12 }}>
              <b>Percent:</b> {grades.percent}%<br />
              <b>Grade (5-point):</b> {grades.grade5}<br />
              <b>Grade (12-point):</b> {grades.grade12}
            </div>
          )}
          {result.mistakes.length > 0 ? (
            <ul>
              {result.mistakes.map((m, i) => (
                <li key={i}>
                  <b>Question:</b> {m.question}<br />
                  <b>Correct answer:</b> {m.correct}<br />
                  <b>Your answer:</b> {m.your}
                </li>
              ))}
            </ul>
          ) : (
            <p>All answers correct! Congratulations!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
