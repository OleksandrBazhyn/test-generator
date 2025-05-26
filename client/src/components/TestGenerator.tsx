import React, { useState } from 'react';
import { generateTests } from '../api/api';
import type { Test, TestMeta } from '../types';

interface TestGeneratorProps {
  onTestsGenerated: (
    tests: Test[],
    testMeta: TestMeta,
    testId: number
  ) => void;
}

/**
 * TestGenerator - form for specifying parameters and generating a new test.
 */
export const TestGenerator: React.FC<TestGeneratorProps> = ({ onTestsGenerated }) => {
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);

  /**
   * Handles test generation via backend.
   */
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim() || count < 1) {
      alert('Please provide subject, topic, and valid count');
      return;
    }
    setLoading(true);
    try {
      const meta: TestMeta = { subject, topic, description, difficulty, grade };
      const { tests, testId } = await generateTests(meta, count);
      onTestsGenerated(tests, meta, testId);
    } catch (err: any) {
      alert(err.message || "Failed to generate tests");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleGenerate} style={{ marginBottom: 24 }}>
      <input
        value={subject}
        onChange={e => setSubject(e.target.value)}
        placeholder="Subject (e.g. math, history, ...)"
        required
        style={{ marginBottom: 8 }}
      />
      <input
        value={topic}
        onChange={e => setTopic(e.target.value)}
        placeholder="Test topic (any: history, programming, HR...)"
        required
      />
      <input
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Extra requirements or description (optional)"
      />
      <input
        value={grade}
        onChange={e => setGrade(e.target.value)}
        placeholder="Grade/level (optional)"
        style={{ marginBottom: 8 }}
      />
      <select
        value={difficulty}
        onChange={e => setDifficulty(e.target.value)}
        style={{ marginRight: 8 }}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <input
        type="number"
        min={1}
        max={50}
        value={count}
        onChange={e => setCount(Number(e.target.value))}
        placeholder="Number of questions"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Tests"}
      </button>
      <p style={{ fontSize: 13, color: "#666" }}>
        You can generate tests on any topic—even memes or professional tasks!
      </p>
    </form>
  );
};
