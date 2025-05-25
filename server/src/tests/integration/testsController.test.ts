import request from 'supertest';
import app from '../../app';
import * as openaiService from '../../services/openaiService';

jest.mock('../../services/openaiService');

const mockQuestions = [
    {
        question: "What is 2+2?",
        options: { A: "3", B: "4", C: "5", D: "6" },
        correct_answer: "B"
    }
];

describe('Tests API', () => {
    beforeAll(() => {
        (openaiService.generateTests as jest.Mock).mockResolvedValue(mockQuestions);
    });

    // POST /api/generate-tests - successful creation
    it('should create a new test', async () => {
        const res = await request(app)
            .post('/api/generate-tests')
            .send({
                subject: 'Biology',
                topic: 'Cell Structure',
                description: 'Short theory plus questions',
                difficulty: 'medium',
                grade: '10',
                count: 1
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data.tests)).toBe(true);
        expect(res.body.data.testId).toBeDefined();
    });

    // GET /api/tests/:id - should return created test
    it('should get a test by id', async () => {
        const postRes = await request(app)
            .post('/api/generate-tests')
            .send({
                subject: 'Math',
                topic: 'Algebra',
                description: '',
                difficulty: 'easy',
                grade: '7',
                count: 1
            });
        const testId = postRes.body.data.testId;

        const res = await request(app).get(`/api/tests/${testId}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(testId);
        expect(res.body.data.questions).toBeDefined();
    });

    // POST /api/check-answers - correct answers, no mistakes
    it('should check answers and return score/mistakes', async () => {
        const postRes = await request(app)
            .post('/api/generate-tests')
            .send({
                subject: 'Math',
                topic: 'Algebra',
                count: 1
            });
        const testId = postRes.body.data.testId;

        const userAnswers = [mockQuestions[0].correct_answer];

        const res = await request(app)
            .post('/api/check-answers')
            .send({
                testId,
                userAnswers
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(typeof res.body.data.score).toBe('number');
        expect(Array.isArray(res.body.data.mistakes)).toBe(true);
        expect(res.body.data.score).toBe(1);
        expect(res.body.data.mistakes.length).toBe(0);
    });

    // GET /api/tests/:id - non-existing test
    it('should return 404 for non-existing test', async () => {
        const res = await request(app).get(`/api/tests/999999`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Test not found');
    });

    // POST /api/generate-tests - invalid data
    it('should return 400 for invalid generate-tests data', async () => {
        const res = await request(app)
            .post('/api/generate-tests')
            .send({ topic: '', count: 0 }); // Missing required fields
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid input');
    });

    // POST /api/check-answers - wrong testId
    it('should return 404 if trying to check answers for nonexistent test', async () => {
        const res = await request(app)
            .post('/api/check-answers')
            .send({
                testId: 999999,
                userAnswers: ['A']
            });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Test not found');
    });

    // POST /api/generate-tests - empty subject/topic
    it('should return 400 if subject or topic is empty', async () => {
        const res = await request(app)
            .post('/api/generate-tests')
            .send({
                subject: '',
                topic: '',
                count: 1
            });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid input');
    });

    // POST /api/check-answers - userAnswers not an array
    it('should return 400 if userAnswers is not an array', async () => {
        const postRes = await request(app)
            .post('/api/generate-tests')
            .send({
                subject: 'Math',
                topic: 'Algebra',
                count: 1
            });
        const testId = postRes.body.data.testId;
        const res = await request(app)
            .post('/api/check-answers')
            .send({
                testId,
                userAnswers: 'A'
            });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid input');
    });

    // POST /api/check-answers - wrong answers, mistakes present
    it('should return mistakes if user answers are incorrect', async () => {
        const postRes = await request(app)
            .post('/api/generate-tests')
            .send({
                subject: 'Math',
                topic: 'Algebra',
                count: 1
            });
        const testId = postRes.body.data.testId;
        const res = await request(app)
            .post('/api/check-answers')
            .send({
                testId,
                userAnswers: ['Z']
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data.mistakes)).toBe(true);
        expect(res.body.data.mistakes.length).toBeGreaterThan(0);
    });

    // GET /api/tests/:id - all main fields exist
    it('should return all fields for a test', async () => {
        const postRes = await request(app)
            .post('/api/generate-tests')
            .send({
                subject: 'Physics',
                topic: 'Mechanics',
                count: 1
            });
        const testId = postRes.body.data.testId;
        const getRes = await request(app).get(`/api/tests/${testId}`);
        expect(getRes.status).toBe(200);
        expect(getRes.body.success).toBe(true);
        expect(getRes.body.data).toHaveProperty('subject');
        expect(getRes.body.data).toHaveProperty('topic');
        expect(getRes.body.data).toHaveProperty('questions');
        expect(Array.isArray(getRes.body.data.questions)).toBe(true);
    });
});

