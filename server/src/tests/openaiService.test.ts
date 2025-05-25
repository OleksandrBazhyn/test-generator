import * as openaiService from '../services/openaiService';

jest.mock('../services/openaiService');

describe('generateTests', () => {
    it('should return array of tests', async () => {
        const mockTests = [
            {
                question: "Test question?",
                options: { A: "1", B: "2", C: "3", D: "4" },
                correct_answer: "A",
            },
        ];
        (openaiService.generateTests as jest.Mock).mockResolvedValue(mockTests);

        const result = await openaiService.generateTests("Math", "Algebra", "7", 1);
        expect(result).toEqual(mockTests);
    });
});