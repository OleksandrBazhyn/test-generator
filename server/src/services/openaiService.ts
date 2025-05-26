import type { Test, TestOption } from '../types';

/**
 * Generates a specified number of test questions using the OpenAI API.
 * Handles long tests by requesting questions in safe-sized chunks,
 * auto-recovers from truncated JSON, and filters only valid questions.
 *
 * @param subject - Subject name (e.g., "Math")
 * @param topic - Topic name (e.g., "Algebra")
 * @param grade - Grade or class (optional)
 * @param count - Total number of questions to generate
 * @param description - Optional requirements or prompt additions
 * @param difficulty - Optional difficulty level
 * @returns Array of valid test questions (may be less than requested if OpenAI fails)
 * @throws Error if OpenAI fails or returns invalid data
 */
export const generateTests = async (
  subject: string,
  topic: string,
  grade: string,
  count: number,
  description?: string,
  difficulty?: string,
): Promise<Test[]> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }

  // How many questions to request per API call (8 is safe for OpenAI)
  const perChunk = 8;
  let allQuestions: Test[] = [];

  for (let offset = 0; allQuestions.length < count && offset < 100; offset += perChunk) {
    const needCount = Math.min(perChunk, count - allQuestions.length);

    // Prompt engineered for strict JSON-only output
    const prompt = `
Generate exactly ${needCount} multiple-choice questions as a JSON array.
Output only a valid JSON array. No explanations, no markdown, no code block.
Each object must have:
  - "question": string
  - "options": {"A": string, "B": string, "C": string, "D": string}
  - "correct_answer": string ("A", "B", "C", or "D")
Questions must be relevant to:
  - subject: "${subject}"
  - topic: "${topic}"
${grade ? `  - grade: "${grade}"` : ""}
${difficulty ? `  - difficulty: "${difficulty}"` : ""}
${description ? `  - requirements: "${description}"` : ""}
Return only valid JSON array and close it correctly.
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
            { role: 'system', content: 'You are a careful test creator for students. Output only valid JSON.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1800,
          temperature: 0.4,
        }),
      });
    } catch (err: any) {
      throw new Error('Failed to connect to OpenAI API');
    }

    let data: any;
    try {
      data = await response.json();
    } catch {
      throw new Error('Failed to parse OpenAI API response');
    }
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    // Defensive cleaning for code block wrappers or incomplete JSON
    let text = data.choices[0].message.content.trim();
    text = text.replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/g, '')
      .trim();
    // Try to auto-complete truncated JSON if needed
    if (!text.endsWith(']')) {
      const lastBracket = text.lastIndexOf('}');
      if (lastBracket !== -1) text = text.slice(0, lastBracket + 1) + ']';
    }
    if (!text.startsWith('[')) {
      const firstBracket = text.indexOf('[');
      if (firstBracket !== -1) text = text.slice(firstBracket);
    }

    let chunkQuestions: Test[];
    try {
      chunkQuestions = JSON.parse(text);
    } catch {
      throw new Error('OpenAI response is not valid JSON');
    }

    // Filter valid questions
    if (Array.isArray(chunkQuestions)) {
      const validQuestions = chunkQuestions.filter(q =>
        typeof q.question === 'string' &&
        typeof q.correct_answer === 'string' &&
        typeof q.options === 'object' &&
        (['A', 'B', 'C', 'D'] as Array<keyof TestOption>).every(k => typeof q.options[k] === 'string')
      );
      allQuestions = allQuestions.concat(validQuestions);
    }

    // If OpenAI returns fewer questions than requested, stop early
    if (!chunkQuestions.length || chunkQuestions.length < needCount) break;
  }

  // Return exactly the requested number (or less, if OpenAI failed)
  return allQuestions.slice(0, count);
};
