export type TestOption = {
    A: string;
    B: string;
    C: string;
    D: string;
};

export type Test = {
    question: string;
    options: TestOption;
    correct_answer: string;
};