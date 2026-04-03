import bcrypt from 'bcryptjs';

import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';

export const register = async (req, res) => {
	const { email, password } = req.body;

	try {
		// field validation
		if (!email || !password)
			return res.status(400).json({ message: 'All fields are required' });

		const user = await User.findOne({ email });

		if (user) return res.status(400).json({ message: 'Email already in use' });

		// passsword hashing
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({ email, password: hashedPassword });

		if (newUser) {
			// generate jwt
			generateToken(newUser._id, res);
			await newUser.save();

			res.status(201).json({ _id: newUser._id, email: newUser.email });
		} else res.status(400).json({ message: 'Invalid user data' });
	} catch (error) {
		console.log(`Error in register controller: ${error.message}`);
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
