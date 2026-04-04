import { GoogleGenAI } from '@google/genai';

export const getReviewFromGemini = async (code) => {
	const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

	const prompt = `You are an expert code reviewer. Analyze the following code and identify all issues.
    
    For each issue you find, write exactly one sentence describing the problem.
    Each sentence must be on its own line, starting with "ISSUE:".
    
    Focus on these areas:
    - Security vulnerabilities (SQL injection, XSS, hardcoded secrets, etc.)
    - Bugs (logic errors, duplicate calls, unhandled errors, etc.)
    - Style (naming conventions, use of outdated syntax, readability, etc.)
    - Performance (unnecessary loops, memory leaks, inefficient operations, etc.)
    
    Do not write any introduction or conclusion.
    Do not group issues together.
    Only write ISSUE: lines.
    
    Code:
    ${code}`;

	const response = await ai.models.generateContent({
		model: 'gemini-2.5-flash',
		contents: prompt,
	});

	return response.text
		.split('\n')
		.filter((line) => line.startsWith('ISSUE:'))
		.map((line) => line.replace('ISSUE:', '').trim());
};
