import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
	mockUserModel,
	mockFindOne,
	mockFindById,
	mockDeleteMany,
	mockSave,
	mockDeleteOne,
	mockGenerateToken,
	mockSendVerificationMail,
	mockSendPasswordResetMail,
	mockHash,
	mockGenSalt,
	mockCompare,
	mockVerify,
} = vi.hoisted(() => {
	const mockSave = vi.fn();
	const mockDeleteOne = vi.fn();
	const mockUserModel = vi.fn(function (userData) {
		return {
			_id: 'user-1',
			...userData,
			save: mockSave,
			deleteOne: mockDeleteOne,
		};
	});

	return {
		mockUserModel,
		mockFindOne: vi.fn(),
		mockFindById: vi.fn(),
		mockDeleteMany: vi.fn(),
		mockSave,
		mockDeleteOne,
		mockGenerateToken: vi.fn(),
		mockSendVerificationMail: vi.fn(),
		mockSendPasswordResetMail: vi.fn(),
		mockHash: vi.fn(),
		mockGenSalt: vi.fn(),
		mockCompare: vi.fn(),
		mockVerify: vi.fn(),
	};
});

vi.mock('../models/User.js', () => ({
	default: Object.assign(mockUserModel, {
		findOne: mockFindOne,
		findById: mockFindById,
	}),
}));

vi.mock('../models/Review.js', () => ({
	default: {
		deleteMany: mockDeleteMany,
	},
}));

vi.mock('../lib/utils.js', () => ({
	generateToken: mockGenerateToken,
}));

vi.mock('../lib/nodemailer.js', () => ({
	sendVerificationMail: mockSendVerificationMail,
	sendPasswordResetMail: mockSendPasswordResetMail,
}));

vi.mock('bcryptjs', () => ({
	default: {
		genSalt: mockGenSalt,
		hash: mockHash,
		compare: mockCompare,
	},
}));

vi.mock('jsonwebtoken', () => ({
	default: {
		verify: mockVerify,
	},
}));

import {
	checkAuth,
	deleteUser,
	forgotPassword,
	login,
	logout,
	register,
	resetPassword,
} from '../controllers/authController.js';
import { protectedRoute } from '../middleware/authMiddleware.js';

function createMockResponse() {
	const res = {};
	res.status = vi.fn().mockReturnValue(res);
	res.json = vi.fn().mockReturnValue(res);
	res.cookie = vi.fn().mockReturnValue(res);
	return res;
}

describe('authController', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGenSalt.mockResolvedValue('salt');
		mockHash.mockResolvedValue('hashed-password');
		mockCompare.mockResolvedValue(true);
		mockVerify.mockReturnValue({ userId: 'user-1' });
	});

	it('registers a new user and sends verification mail', async () => {
		const savedUser = {
			_id: 'user-1',
			email: 'test@example.com',
			verificationToken: 'token-1',
			save: mockSave,
		};
		mockFindOne.mockResolvedValue(null);
		mockSave.mockResolvedValue(savedUser);
		mockSendVerificationMail.mockResolvedValue();
		const req = {
			body: { email: 'test@example.com', password: 'Password123!' },
		};
		const res = createMockResponse();

		await register(req, res);

		expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
		expect(mockSendVerificationMail).toHaveBeenCalledWith(
			'test@example.com',
			expect.any(String),
		);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			_id: 'user-1',
			email: 'test@example.com',
			verificationToken: expect.any(String),
		});
	});

	it('rejects registration when email already exists', async () => {
		mockFindOne.mockResolvedValue({ _id: 'existing-user' });
		const req = {
			body: { email: 'test@example.com', password: 'Password123!' },
		};
		const res = createMockResponse();

		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: 'Email already in use' });
	});

	it('rejects registration with invalid email format', async () => {
		const req = { body: { email: 'invalid-email', password: 'Password123!' } };
		const res = createMockResponse();

		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
		expect(mockFindOne).not.toHaveBeenCalled();
	});

	it('rejects registration with short password', async () => {
		const req = { body: { email: 'test@example.com', password: 'short' } };
		const res = createMockResponse();

		await register(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Password must be at least 8 characters.',
		});
		expect(mockFindOne).not.toHaveBeenCalled();
	});

	it('blocks login before email verification', async () => {
		mockFindOne.mockResolvedValue({ isVerified: false });
		const req = {
			body: { email: 'test@example.com', password: 'Password123!' },
		};
		const res = createMockResponse();

		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Please verify your email',
		});
		expect(mockCompare).not.toHaveBeenCalled();
	});

	it('logs in a verified user with correct password', async () => {
		mockFindOne.mockResolvedValue({
			_id: 'user-1',
			email: 'test@example.com',
			isVerified: true,
			password: 'hashed-password',
		});
		const req = {
			body: { email: 'test@example.com', password: 'Password123!' },
		};
		const res = createMockResponse();

		await login(req, res);

		expect(mockCompare).toHaveBeenCalledWith('Password123!', 'hashed-password');
		expect(mockGenerateToken).toHaveBeenCalledWith('user-1', res);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			_id: 'user-1',
			email: 'test@example.com',
		});
	});

	it('returns 401 for protected route without jwt cookie', async () => {
		const req = { cookies: {} };
		const res = createMockResponse();
		const next = vi.fn();

		await protectedRoute(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Unauthorized - No token provided',
		});
		expect(next).not.toHaveBeenCalled();
	});

	it('deletes the user account and their reviews', async () => {
		const user = {
			_id: { toString: () => 'user-1' },
			deleteOne: mockDeleteOne,
		};
		mockFindById.mockResolvedValue(user);
		mockDeleteMany.mockResolvedValue();
		mockDeleteOne.mockResolvedValue();
		const req = {
			params: { id: 'user-1' },
			user: { _id: { toString: () => 'user-1' } },
		};
		const res = createMockResponse();

		await deleteUser(req, res);

		expect(mockDeleteMany).toHaveBeenCalledWith({ userId: 'user-1' });
		expect(mockDeleteOne).toHaveBeenCalled();
		expect(res.cookie).toHaveBeenCalledWith('jwt', '', { maxAge: 0 });
		expect(res.status).toHaveBeenCalledWith(200);
	});

	it('accepts a valid password reset request', async () => {
		mockFindOne.mockResolvedValue({
			resetPasswordTokenExpiry: new Date(Date.now() + 60_000),
			save: mockSave,
		});
		mockSave.mockResolvedValue();
		const req = {
			query: { token: 'reset-token' },
			body: { newPassword: 'NewPassword123!' },
		};
		const res = createMockResponse();

		await resetPassword(req, res);

		expect(mockHash).toHaveBeenCalledWith('NewPassword123!', 'salt');
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Password changed successfully.',
		});
	});

	it('returns the authenticated user in checkAuth', () => {
		const req = { user: { _id: 'user-1', email: 'test@example.com' } };
		const res = createMockResponse();

		checkAuth(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(req.user);
	});

	it('logs out by clearing the jwt cookie', () => {
		const req = {};
		const res = createMockResponse();

		logout(req, res);

		expect(res.cookie).toHaveBeenCalledWith('jwt', '', { maxAge: 0 });
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Logged out successfully',
		});
	});

	it('creates a reset token for existing users', async () => {
		const user = { save: mockSave };
		mockFindOne.mockResolvedValue(user);
		mockSave.mockResolvedValue(user);
		mockSendPasswordResetMail.mockResolvedValue();
		const req = { body: { email: 'test@example.com' } };
		const res = createMockResponse();

		await forgotPassword(req, res);

		expect(mockSendPasswordResetMail).toHaveBeenCalledWith(
			'test@example.com',
			expect.any(String),
		);
		expect(res.status).toHaveBeenCalledWith(200);
	});
});
