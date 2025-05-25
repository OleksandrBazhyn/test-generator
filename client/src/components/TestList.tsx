import React from 'react';
import type { Test } from '../types';

interface TestListProps {
  tests: Test[];
  userAnswers: string[];
  onAnswer: (idx: number, value: string) => void;
  showCorrect?: boolean;
}

export const TestList: React.FC<TestListProps> = ({ tests, userAnswers, onAnswer, showCorrect }) => (
  <div>
    {tests.map((q, idx) => (
      <div key={idx} style={{ marginBottom: 16, border: '1px solid #eee', padding: 8 }}>
        <div><strong>{idx + 1}. {q.question}</strong></div>
        {Object.entries(q.options).map(([letter, option]) => (
          <div key={letter}>
            <label>
              <input
                type="radio"
                name={`question-${idx}`}
                value={letter}
                checked={userAnswers[idx] === letter}
                onChange={() => onAnswer(idx, letter)}
                disabled={showCorrect}
              />
              {letter}. {option}
              {showCorrect && q.correct_answer === letter && (
                <span style={{ color: 'green', marginLeft: 8 }}>✓</span>
              )}
            </label>
          </div>
        ))}
      </div>
    ))}
  </div>
);
