import dotenv from 'dotenv';
dotenv.config();

import { getReviewFromGemini } from './lib/gemini.js';

const result = await getReviewFromGemini('console.log(password)');
console.log(result);
