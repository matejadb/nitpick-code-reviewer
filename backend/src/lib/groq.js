import OpenAI from 'openai';

export const getReviewFromGroq = async (code) => {
	const client = new OpenAI({
		apiKey: process.env.GROQ_API_KEY,
		baseURL: 'https://api.groq.com/openai/v1',
	});

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

	const response = await client.responses.create({
		model: 'llama-3.3-70b-versatile',
		input: prompt,
	});

	// console.log(response.output_text);

	return response.output_text
		.split('\n')
		.filter((line) => line.startsWith('ISSUE:'))
		.map((line) => line.replace('ISSUE:', '').trim());
};
