import { Request, Response } from 'express';
import * as openaiService from '../services/openaiService';
import pool from '../db';

// Generate tests and save to DB
export const generateTests = async (req: Request, res: Response) => {
    const { subject, topic, grade, count } = req.body;
    try {
        const tests = await openaiService.generateTests(subject, topic, grade, count);
        const result = await pool.query(
            'INSERT INTO tests (subject, topic, grade, questions) VALUES ($1, $2, $3, $4) RETURNING *',
            [subject, topic, grade, JSON.stringify(tests)]
        );
        res.json({ tests: result.rows[0].questions });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

// Get test by ID
export const getTestById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tests WHERE id = $1', [id]);
        if (!result.rows.length) return res.status(404).json({ error: 'Test not found' });
        res.json(result.rows[0]);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

// Check user answers
export const checkAnswers = async (req: Request, res: Response) => {
    const { testId, userAnswers } = req.body;
    try {
        const result = await pool.query('SELECT * FROM tests WHERE id = $1', [testId]);
        if (!result.rows.length) return res.status(404).json({ error: 'Test not found' });

        const test = result.rows[0];
        const questions = test.questions;
        let score = 0;
        const mistakes: any[] = [];

        questions.forEach((q: any, idx: number) => {
            if (userAnswers[idx] === q.correct_answer) {
                score++;
            } else {
                mistakes.push({ question: q.question, correct: q.correct_answer, your: userAnswers[idx] });
            }
        });

        // Зберегти результат у answers
        await pool.query(
            'INSERT INTO answers (test_id, user_answers, score, mistakes) VALUES ($1, $2, $3, $4)',
            [testId, JSON.stringify(userAnswers), score, JSON.stringify(mistakes)]
        );

        res.json({ score, mistakes });
    } catch (e: any) {
        console.error('Error in checkAnswers:', e);
        res.status(500).json({ error: e.message, stack: e.stack });
    }
};