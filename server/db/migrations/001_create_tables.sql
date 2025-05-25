-- Table for tests (main questions bank)
CREATE TABLE IF NOT EXISTS tests (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20),
    grade VARCHAR(20),
    questions JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for answers (stores test results)
CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    test_id INTEGER NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    user_answers JSONB NOT NULL,
    score INTEGER,
    mistakes JSONB,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster search by subject and topic
CREATE INDEX IF NOT EXISTS idx_tests_subject ON tests(subject);
CREATE INDEX IF NOT EXISTS idx_tests_topic ON tests(topic);
CREATE INDEX IF NOT EXISTS idx_answers_test_id ON answers(test_id);
