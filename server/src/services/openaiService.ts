import type { Test, TestOption } from '../types'

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

    let response: Response;
    try {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are a helpful teacher who creates test questions for students.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 1500,
                temperature: 0.5,
            }),
        });
    } catch (err) {
        throw new Error('Failed to connect to OpenAI API');
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json() as {
        choices: { message: { content: string } }[];
    };

    if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error('Invalid response from OpenAI API');
    }

    const text = data.choices[0].message.content.trim();

    let tests: Test[];
    try {
        tests = JSON.parse(text);
    } catch (e) {
        // Logging in for diagnostics
        console.error('Failed to parse OpenAI response:', text);
        throw new Error('Failed to parse OpenAI response as JSON');
    }

    // Checking the test structure (optional)
    if (!Array.isArray(tests) || !tests.every(q =>
        typeof q.question === 'string' &&
        typeof q.correct_answer === 'string' &&
        typeof q.options === 'object' &&
        (['A', 'B', 'C', 'D'] as Array<keyof TestOption>).every(k => typeof q.options[k] === 'string')
    )) {
        throw new Error('OpenAI response does not match expected test format');
    }

    return tests;
};