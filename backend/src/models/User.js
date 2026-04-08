import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	isVerified: {
		type: Boolean,
		required: true,
		default: false,
	},
	verificationToken: {
		type: String,
	},
	verificationTokenExpiry: {
		type: Date,
		default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
	},
});

const User = mongoose.model('User', userSchema);

export default User;
