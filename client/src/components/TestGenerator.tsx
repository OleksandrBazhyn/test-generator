import React, { useState } from 'react';
import { generateTests } from '../api/api';
import type { Test } from '../types';

// ОНОВЛЕНИЙ інтерфейс пропсів: тепер приймає 3 аргументи!
interface TestGeneratorProps {
  onTestsGenerated: (
    tests: Test[],
    testMeta: { subject: string; topic: string; grade: string },
    testId: number
  ) => void;
}

export const TestGenerator: React.FC<TestGeneratorProps> = ({ onTestsGenerated }) => {
  const [subject, setSubject] = useState('Математика');
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('9');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // generateTests повертає { tests, testId }
      const { tests, testId } = await generateTests(subject, topic, grade, count);
      onTestsGenerated(tests, { subject, topic, grade }, testId); // 3 аргументи!
    } catch (err: any) {
      alert(err.message || "Не вдалося згенерувати тести");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleGenerate} style={{ marginBottom: 24 }}>
      <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Предмет" required />
      <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Тема" required />
      <input value={grade} onChange={e => setGrade(e.target.value)} placeholder="Клас" required />
      <input
        type="number"
        min={1}
        max={20}
        value={count}
        onChange={e => setCount(Number(e.target.value))}
        placeholder="Кількість питань"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Генеруємо..." : "Згенерувати тести"}
      </button>
    </form>
  );
};
