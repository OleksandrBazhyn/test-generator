jest.mock('../../db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  }
}));

import * as openaiService from '../../services/openaiService';

describe('generateTests (mocked)', () => {
    const mockTests = [
        {
            question: "Test question?",
            options: { A: "1", B: "2", C: "3", D: "4" },
            correct_answer: "A",
        },
    ];

    beforeEach(() => {
        jest.resetModules(); // Clear module cache if needed
    });

    it('should return array of tests (mock)', async () => {
        jest.spyOn(openaiService, 'generateTests').mockResolvedValueOnce(mockTests);

        const result = await openaiService.generateTests("Math", "Algebra", "7", 1);
        expect(result).toEqual(mockTests);
    });

    it('should throw error on API failure (mock)', async () => {
        jest.spyOn(openaiService, 'generateTests').mockRejectedValueOnce(new Error('API error'));
        await expect(openaiService.generateTests("Math", "Algebra", "7", 1)).rejects.toThrow('API error');
    });

    it('should throw error if OPENAI_API_KEY is missing', async () => {
        const original = process.env.OPENAI_API_KEY;
        delete process.env.OPENAI_API_KEY;
        jest.resetModules();
        const { generateTests } = require('../../services/openaiService');
        await expect(generateTests('Math', 'Algebra', '7', 1))
            .rejects
            .toThrow('OPENAI_API_KEY is not set in environment variables');
        process.env.OPENAI_API_KEY = original;
    });
});

/**
 * Integration test with real OpenAI API.
 * Skipped by default to avoid accidental token usage!
 * Remove .skip to run manually if you want to check real API and your API key is set.
 */
describe.skip('generateTests (integration with real OpenAI API)', () => {
    it('should return an array of valid test questions', async () => {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('No OPENAI_API_KEY set, skipping real API integration test.');
            return;
        }

        const result = await openaiService.generateTests(
            "English",
            "Grammar",
            "10",
            1,
            "Simple question for test",
            "easy"
        );
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(typeof result[0].question).toBe('string');
        expect(typeof result[0].correct_answer).toBe('string');
        expect(typeof result[0].options).toBe('object');
        expect(['A', 'B', 'C', 'D']).toContain(result[0].correct_answer);
    });
});
