import pool from '../db';

// Clean up test tables before each test
beforeEach(async () => {
  await pool.query('TRUNCATE TABLE answers, tests RESTART IDENTITY CASCADE;');
});

afterAll(async () => {
  await pool.end();
});