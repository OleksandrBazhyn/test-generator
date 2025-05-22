type TestOption = {
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

export const generateTests = async (
    subject: string, topic: string, grade: string, count: number
): Promise<Test[]> => {
    const prompt = `
    Generate ${count} multiple-choice questions in ${subject} for grade ${grade}, topic: "${topic}". 
    Each question must include: question text, four answer options (A, B, C, D), and the correct answer (letter only). 
    Return result as valid JSON array like:
    [{"question": "...", "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, "correct_answer": "A"}]
    No explanations. JSON only.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: 'You are a helpful teacher who creates test questions for students.'},
                { role: 'user', content: prompt }
            ],
            max_tokens: 1500,
            temperature: 0.5, // Maybe I can use this to set the difficulty of the tests
        }),
    });

    const data = await response.json() as {
        choices: { message: { content: string } }[];
    };
    const text = data.choices[0].message.content.trim();

    let tests: Test[];
    try {
        tests = JSON.parse(text);
    } catch (e) {
        throw new Error('Failed to parse OpenAI response');
    }
    return tests;
};