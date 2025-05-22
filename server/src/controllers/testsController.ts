import { Request, Response } from 'express';
import * as openaiService from '../services/openaiService';
import pool from '../db';

export const generateTests = async (req: Request, res: Response) => {
    const { subject, topic, grade, count } = req.body;
    try {
        const tests = await openaiService.generateTests(subject, topic, grade, count);
        // TODO: Save to Postgres
        res.json({ tests });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
};

export const checkAnswers = async (req: Request, res: Response) => {
    // TODO: Implement checking
};