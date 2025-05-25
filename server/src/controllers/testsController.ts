import { Request, Response } from 'express';
import * as openaiService from '../services/openaiService';
import pool from '../db';
import type { Test, TestMeta } from '../types';
import { z } from 'zod';

/**
 * Zod schema for validating incoming test metadata.
 */
const TestMetaSchema = z.object({
  subject: z.string().min(1),
  topic: z.string().min(1),
  description: z.string().optional(),
  difficulty: z.string().optional(),
  grade: z.string().optional(),
  count: z.number().min(1).max(50)
});

/**
 * Zod schema for validating answers check request.
 */
const CheckAnswersSchema = z.object({
  testId: z.number().int().positive(),
  userAnswers: z.array(z.string().min(1)).min(1)
});

/**
 * Generate tests using OpenAI and save to DB.
 * @route POST /api/generate-tests
 */
export const generateTests = async (req: Request, res: Response) => {
  try {
    const parsed = TestMetaSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.errors });
    }
    const { subject, topic, description, difficulty, grade, count } = parsed.data;

    const tests = await openaiService.generateTests(
      subject,
      topic,
      grade ?? '',
      count,
      description ?? '',
      difficulty ?? ''
    );

    const dbResult = await pool.query(
      `INSERT INTO tests (subject, topic, description, difficulty, grade, questions)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [subject, topic, description ?? '', difficulty ?? '', grade ?? '', JSON.stringify(tests)]
    );

    return res.json({ success: true, data: { tests: dbResult.rows[0].questions, testId: dbResult.rows[0].id } });
  } catch (e: any) {
    console.error('Error in generateTests:', e);
    return res.status(500).json({ error: 'Internal server error', details: e.message });
  }
};

/**
 * Get test by its ID.
 * @route GET /api/tests/:id
 */
export const getTestById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid test ID' });
  }
  try {
    const result = await pool.query('SELECT * FROM tests WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Test not found' });
    return res.json({ success: true, data: result.rows[0] });
  } catch (e: any) {
    console.error('Error in getTestById:', e);
    return res.status(500).json({ error: 'Internal server error', details: e.message });
  }
};

/**
 * Check user answers and save result.
 * @route POST /api/check-answers
 */
export const checkAnswers = async (req: Request, res: Response) => {
  try {
    const parsed = CheckAnswersSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.errors });
    }
    const { testId, userAnswers } = parsed.data;

    const testResult = await pool.query('SELECT * FROM tests WHERE id = $1', [testId]);
    if (!testResult.rows.length) return res.status(404).json({ error: 'Test not found' });

    const questions = testResult.rows[0].questions;
    let score = 0;
    const mistakes: { question: string; correct: string; your: string }[] = [];

    questions.forEach((q: any, idx: number) => {
      if (userAnswers[idx] === q.correct_answer) {
        score++;
      } else {
        mistakes.push({ question: q.question, correct: q.correct_answer, your: userAnswers[idx] });
      }
    });

    await pool.query(
      'INSERT INTO answers (test_id, user_answers, score, mistakes) VALUES ($1, $2, $3, $4)',
      [testId, JSON.stringify(userAnswers), score, JSON.stringify(mistakes)]
    );

    return res.json({ success: true, data: { score, mistakes } });
  } catch (e: any) {
    console.error('Error in checkAnswers:', e);
    return res.status(500).json({ error: 'Internal server error', details: e.message });
  }
};
