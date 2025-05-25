import React, { useState } from 'react';
import type { Test } from './types';
import { TestGenerator } from './components/TestGenerator';
import { TestList } from './components/TestList';
import { TestChecker } from './components/TestChecker';
import { PdfExportButton } from './components/PdfExportButton';
import { checkAnswers } from './api/api';

const App: React.FC = () => {
  const [testId, setTestId] = useState<number | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [testMeta, setTestMeta] = useState<{ subject: string; topic: string; grade: string } | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<{ score: number; mistakes: any[] } | null>(null);
  const [checking, setChecking] = useState(false);

  // Три аргументи: тести, мета, id!
  const handleTestsGenerated = (
    generated: Test[],
    meta: { subject: string; topic: string; grade: string },
    id: number
  ) => {
    setTests(generated);
    setTestMeta(meta);
    setTestId(id);
    setUserAnswers(Array(generated.length).fill(''));
    setResult(null);
  };

  const handleAnswer = (idx: number, value: string) => {
    setUserAnswers(ans => {
      const newAns = [...ans];
      newAns[idx] = value;
      return newAns;
    });
  };

  const handleCheck = async () => {
    if (userAnswers.some(ans => !ans)) {
      alert('Заповніть відповіді на всі питання!');
      return;
    }
    if (!testId) {
      alert('ID тесту відсутній!');
      return;
    }
    setChecking(true);
    try {
      const res = await checkAnswers(testId, userAnswers);
      setResult(res);
    } catch (e: any) {
      alert(e.message || "Не вдалося перевірити тести");
    }
    setChecking(false);
  };

  return (
    <div style={{ maxWidth: 650, margin: '0 auto', padding: 24 }}>
      <h1>Генератор тестів</h1>
      <TestGenerator onTestsGenerated={handleTestsGenerated} />
      {testMeta && (
        <div style={{ margin: "8px 0", color: "#666" }}>
          <b>Предмет:</b> {testMeta.subject} | <b>Тема:</b> {testMeta.topic} | <b>Клас:</b> {testMeta.grade}
        </div>
      )}
      {tests.length > 0 && (
        <>
          <TestList tests={tests} userAnswers={userAnswers} onAnswer={handleAnswer} />
          {!result && (
            <button onClick={handleCheck} disabled={checking} style={{ marginTop: 12 }}>
              {checking ? "Перевіряємо..." : "Перевірити"}
            </button>
          )}
          <PdfExportButton questions={tests} answers={userAnswers} />
          {result && <TestChecker score={result.score} mistakes={result.mistakes} />}
        </>
      )}
    </div>
  );
};

export default App;
