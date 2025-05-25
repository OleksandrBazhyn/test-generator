import React from 'react';

interface TestCheckerProps {
  score: number;
  mistakes: { question: string; correct: string; your: string }[];
}

export const TestChecker: React.FC<TestCheckerProps> = ({ score, mistakes }) => (
  <div style={{ marginTop: 24 }}>
    <h2>Результат</h2>
    <p>Ваша оцінка: {score}</p>
    {mistakes.length > 0 && (
      <div>
        <h3>Помилки:</h3>
        <ul>
          {mistakes.map((m, i) => (
            <li key={i}>
              <strong>Питання:</strong> {m.question}<br />
              <strong>Правильна відповідь:</strong> {m.correct} <br />
              <strong>Ваша відповідь:</strong> {m.your}
            </li>
          ))}
        </ul>
      </div>
    )}
    {mistakes.length === 0 && <p>Усі відповіді вірні! Вітаємо!</p>}
  </div>
);
