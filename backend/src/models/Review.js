import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		submittedCode: {
			type: String,
			required: true,
		},
		critiquesList: [
			{
				text: { type: String, required: true },
				category: { type: String, required: true },
			},
		],
	},
	{
		timestamps: true,
	},
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
