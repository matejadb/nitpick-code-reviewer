// import { getReviewFromGemini } from '../lib/gemini.js';
import axios from 'axios';

import { getReviewFromGroq } from '../lib/groq.js';
import Review from '../models/Review.js';

export const sendCode = async (req, res) => {
	const { code } = req.body;

	try {
		if (!code)
			return res
				.status(400)
				.json({ message: 'Empty message field. Please provide your code.' });

		const user = req.user;

		// gemini logic, small rate limit, might use...
		// const geminiResponse = await getReviewFromGemini(code);
		// geminiResponse.forEach((element) => {
		// 	critiquesList.push({ text: element, category: 'test' });
		// });

		const groqResponse = await getReviewFromGroq(code);
		const critiquesList = [];

		for (const element of groqResponse) {
			const category = await axios.post('http://localhost:5001/classify', {
				text: element,
			});

			critiquesList.push({ text: element, category: category.data.category });
		}

		const newReview = new Review({
			userId: user._id,
			submittedCode: code,
			critiquesList,
		});

		if (newReview) {
			await newReview.save();

			res.status(201).json({
				userId: newReview.userId,
				submittedCode: newReview.submittedCode,
				critiquesList: newReview.critiquesList,
			});
		} else res.status(400).json({ message: 'Invalid code submission data' });
	} catch (error) {
		console.log(`Error in sendCode controller: ${error.message}`);
		res.status(500).json({ message: 'Internal server error' });
	}
};
