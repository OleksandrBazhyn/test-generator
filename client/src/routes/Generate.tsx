import React, { useState } from 'react';
import { checkAnswers } from '../api/api';

/**
 * Generate route page for checking answers by test ID and user answers.
 */
const Generate: React.FC = () => {
  const [testId, setTestId] = useState('');
  const [answers, setAnswers] = useState('');
  const [result, setResult] = useState<{ score: number; mistakes: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles form submit and checks answers.
   */
  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testId || !answers) {
      alert('Please enter test ID and answers');
      return;
    }
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
   * Calculates grading in percent, 5-point, and 12-point systems.
   */
  const getGrades = () => {
    if (!result) return null;
    const total = result.score + result.mistakes.length;
    if (!total) return null;
    const percent = Math.round((result.score / total) * 100);

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

export default Generate;
