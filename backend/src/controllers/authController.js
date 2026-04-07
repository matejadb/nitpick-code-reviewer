import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';
import { sendVerificationMail } from '../lib/nodemailer.js';

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

		// generate jwt
		generateToken(newUser._id, res);
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
		user.verificationToken = undefined;
		user.verificationTokenExpiry = undefined;

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

export const checkAuth = (req, res) => {
	try {
		res.status(200).json(req.user);
	} catch (error) {
		console.log(`Error in checkAuth controller: ${error.message}`);
		res.status(500).json({ message: 'Internal server error' });
	}
};
