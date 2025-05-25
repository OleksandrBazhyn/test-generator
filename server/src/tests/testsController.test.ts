import request from 'supertest';
import app from '../app';

describe('POST /api/generate-tests', () => {
    it('should return test array', async () => {
        const res = await request(app)
        .post('/api/generate-tests')
        .send({
            subject: 'Math',
            topic: 'Algebra',
            grade: '7',
            count: 1,
        });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.tests)).toBe(true);
    });
});