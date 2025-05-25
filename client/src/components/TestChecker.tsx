import React from 'react';

interface TestCheckerProps {
  score: number;
  mistakes: { question: string; correct: string; your: string }[];
}

/**
 * TestChecker - displays user's score and list of mistakes for a test.
 */
export const TestChecker: React.FC<TestCheckerProps> = ({ score, mistakes }) => (
  <div style={{ marginTop: 24 }}>
    <h2>Result</h2>
    <p>Your score: {score}</p>
    {mistakes.length > 0 ? (
      <div>
        <h3>Mistakes:</h3>
        <ul>
          {mistakes.map((m, i) => (
            <li key={i}>
              <strong>Question:</strong> {m.question}<br />
              <strong>Correct answer:</strong> {m.correct} <br />
              <strong>Your answer:</strong> {m.your}
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <p>All answers correct! Congratulations!</p>
    )}
  </div>
);
