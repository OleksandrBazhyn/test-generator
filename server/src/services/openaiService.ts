import type { Test, TestOption } from '../types';

/**
 * Calls OpenAI API to generate test questions.
 * 
 * @param subject - Subject name (e.g., "Math")
 * @param topic - Topic name (e.g., "Algebra")
 * @param grade - Grade or class (e.g., "9")
 * @param count - Number of questions to generate
 * @param description - (Optional) Description or requirements
 * @param difficulty - (Optional) Difficulty level
 * @returns Promise<Test[]> - Array of test question objects
 * @throws Error if OpenAI API fails or returns invalid data
 */
export const generateTests = async (
    subject: string,
    topic: string,
    grade: string,
    count: number,
    description?: string,
    difficulty?: string,
): Promise<Test[]> => {
    // Check API key before making a request
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    const prompt = `
        Generate ${count} multiple-choice questions for subject: "${subject}", topic: "${topic}"${grade ? `, grade: ${grade}` : ''}${description ? `, requirements: ${description}` : ''}${difficulty ? `, difficulty: ${difficulty}` : ''}.
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
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a helpful teacher who creates test questions for students.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 1500,
                temperature: 0.5,
            }),
        });
    } catch (err: any) {
        // Network or DNS error
        console.error('[OpenAI] Network error:', err);
        throw new Error('Failed to connect to OpenAI API');
    }

    if (!response.ok) {
        const errorText = await response.text();
        // Log detailed API error
        console.error('[OpenAI] API error:', response.status, response.statusText, errorText);
        if (response.status === 401 || response.status === 403) {
            throw new Error('OpenAI API authentication error');
        }
        if (response.status === 429) {
            throw new Error('OpenAI API rate limit exceeded. Please try again later.');
        }
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    interface OpenAIResponse {
        choices: { message: { content: string } }[];
    }

    let data: OpenAIResponse;
    try {
        data = await response.json();
    } catch (err: any) {
        console.error('[OpenAI] Failed to parse API JSON:', err);
        throw new Error('Failed to parse OpenAI API response');
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error('Invalid response from OpenAI API');
    }

    // Remove ```json ... ``` wrappers if present
    const text = data.choices[0].message.content.trim();
    const cleanedText = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

    let tests: Test[];
    try {
        tests = JSON.parse(cleanedText);
    } catch (e) {
        console.error('[OpenAI] Failed to parse response as JSON:', text);
        throw new Error('Failed to parse OpenAI response as JSON');
    }

    // Validate shape of result
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
