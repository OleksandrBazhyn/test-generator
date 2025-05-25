/**
 * Answer options for a single test question.
 */
export type TestOption = {
  A: string;
  B: string;
  C: string;
  D: string;
};

/**
 * Test question structure.
 */
export type Test = {
  question: string;
  options: TestOption;
  correct_answer: string;
};

/**
 * Metadata for test generation.
 */
export type TestMeta = {
  subject: string;
  topic: string;
  description?: string;
  difficulty?: string;
  grade?: string;
};
