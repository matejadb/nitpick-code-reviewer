import { getReviewFromGemini } from '../lib/gemini.js';
import Review from '../models/Review.js';

export const sendCode = async (req, res) => {
	const { code } = req.body;

	try {
		if (!code)
			return res
				.status(400)
				.json({ message: 'Empty message field. Please provide your code.' });

		const user = req.user;

		const geminiResponse = await getReviewFromGemini(code);

		console.log(geminiResponse);

		const critiquesList = [];

		geminiResponse.forEach((element) => {
			critiquesList.push({ text: element, category: 'test' });
		});

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
