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

		const groqResponse = await getReviewFromGroq(code);
		const critiquesList = [];

		for (const element of groqResponse) {
			const category = await axios.post(
				`${process.env.ML_SERVICE_URL}/classify`,
				{
					text: element,
				},
			);

			critiquesList.push({ text: element, category: category.data.category });
		}

		const newReview = new Review({
			userId: user._id,
			submittedCode: code,
			critiquesList,
		});

		await newReview.save();

		res.status(201).json(newReview.toObject());
	} catch (error) {
		console.log(`Error in sendCode controller: ${error.message}`);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const getReviews = async (req, res) => {
	try {
		const userReviews = await Review.find({ userId: req.user._id }).sort({
			createdAt: -1,
		});

		res.status(200).json(userReviews);
	} catch (error) {
		console.log(`Error in getReviews controller: ${error.message}`);
		res.status(500).json({ message: 'Internal server error' });
	}
};
