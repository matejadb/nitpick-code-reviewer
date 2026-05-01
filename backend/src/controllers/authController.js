import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';
import {
	sendPasswordResetMail,
	sendVerificationMail,
} from '../lib/nodemailer.js';
import Review from '../models/Review.js';

export const register = async (req, res) => {
	const { email, password } = req.body;

	try {
		// field validation
		if (!email || !password)
			return res.status(400).json({ message: 'All fields are required' });

		const user = await User.findOne({ email });

		if (user) return res.status(400).json({ message: 'Email already in use' });

		// generate activation token
		const verificationToken = crypto.randomBytes(32).toString('hex');

		// passsword hashing
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			email,
			password: hashedPassword,
			verificationToken,
		});
		await newUser.save();

		await sendVerificationMail(email, verificationToken);

		res.status(201).json({
			_id: newUser._id,
			email: newUser.email,
			verificationToken: newUser.verificationToken,
		});
	} catch (error) {
		console.log(`Error in register controller: ${error.message}`);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const verifyEmail = async (req, res) => {
	try {
		const token = req.query.token;
		const user = await User.findOne({ verificationToken: token });

		if (!user) return res.status(404).json({ message: 'User not found' });

		const now = new Date();

		if (now > user.verificationTokenExpiry)
			return res
				.status(400)
				.json({ message: 'Verification token has expired.' });

		user.isVerified = true;
		user.verificationToken = null;
		user.verificationTokenExpiry = null;
		user.resetPasswordTokenExpiry = null;
		await user.save();

		res.status(200).json({ isVerified: true });
	} catch (error) {
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) return res.status(400).json({ message: 'Invalid credentials' });

		if (!user.isVerified)
			return res.status(403).json({ message: 'Please verify your email' });

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect)
			return res.status(400).json({ message: 'Invalid credentials' });

		generateToken(user._id, res);

		res.status(200).json({
			_id: user._id,
			email: user.email,
		});
	} catch (error) {
		console.log(`Error in login controller: ${error.message}`);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie('jwt', '', { maxAge: 0 });
		res.status(200).json({ message: 'Logged out successfully' });
	} catch (error) {
		console.log(`Error in logout controller: ${error.message}`);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const id = req.params.id;

		const user = await User.findById(id);

		if (!user) return res.status(404).json({ message: `User not found.` });

		if (user._id.toString() !== req.user._id.toString())
			return res
				.status(403)
				.json({ message: `You can only delete your own account.` });

		await Review.deleteMany({ userId: id });

		await user.deleteOne();

		res.cookie('jwt', '', { maxAge: 0 });
		res.status(200).json({ message: `User successfully deleted` });
	} catch (error) {
		res.status(500).json({ message: `Internal server error.` });
	}
};

export const checkAuth = (req, res) => {
	try {
		res.status(200).json(req.user);
	} catch (error) {
		console.log(`Error in checkAuth controller: ${error.message}`);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });

		if (!user)
			return res.status(200).json({
				message: `We’ve sent you an email with instructions to reset your password.`,
			});

		const resetPasswordToken = crypto.randomBytes(32).toString('hex');

		user.resetPasswordToken = resetPasswordToken;
		user.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

		await user.save();

		await sendPasswordResetMail(email, resetPasswordToken);
		res.status(200).json({
			message: `We’ve sent you an email with instructions to reset your password.`,
		});
	} catch (error) {
		res.status(500).json({ message: `Internal server error.` });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const token = req.query.token;
		const { newPassword } = req.body;

		const user = await User.findOne({ resetPasswordToken: token });
		if (!user) return res.status(404).json({ message: `User not found` });

		const now = new Date();

		if (now > user.resetPasswordTokenExpiry)
			return res.status(400).json({ message: `Token has expired.` });

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		user.password = hashedPassword;
		user.resetPasswordToken = null;
		user.resetPasswordTokenExpiry = null;
		user.verificationTokenExpiry = null;
		await user.save();
		res.status(200).json({ message: `Password changed successfully.` });
	} catch (error) {
		res.status(500).json({ message: `Internal server error.` });
	}
};
