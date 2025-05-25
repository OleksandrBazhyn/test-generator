/**
 * TestOption: Option set for a question (A, B, C, D).
 */
export type TestOption = {
    A: string;
    B: string;
    C: string;
    D: string;
};

/**
 * Test: Structure of a test question.
 */
export type Test = {
    question: string;
    options: TestOption;
    correct_answer: string;
};

/**
 * TestMeta: Meta info for generating tests.
 */
export type TestMeta = {
    subject: string;
    topic: string;
    description?: string;
    difficulty?: string;
    grade?: string;
};
