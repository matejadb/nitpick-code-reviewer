import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

const {
	mockUserModel,
	mockReviewModel,
	mockUserFindOne,
	mockUserFindById,
	mockReviewFind,
	mockReviewFindById,
	mockReviewDeleteMany,
	mockUserSave,
	mockReviewSave,
	mockReviewDeleteOne,
	mockGenerateToken,
	mockSendVerificationMail,
	mockSendPasswordResetMail,
	mockHash,
	mockGenSalt,
	mockCompare,
	mockVerify,
	mockGroqReview,
	mockAxiosPost,
} = vi.hoisted(() => {
	const mockUserSave = vi.fn();
	const mockReviewSave = vi.fn();
	const mockReviewDeleteOne = vi.fn();

	const mockUserModel = vi.fn(function (userData) {
		return {
			_id: 'user-1',
			...userData,
			save: mockUserSave,
			deleteOne: vi.fn(),
		};
	});

	const mockReviewModel = vi.fn(function (reviewData) {
		return {
			_id: 'review-1',
			...reviewData,
			save: mockReviewSave,
			toObject() {
				return {
					_id: 'review-1',
					...reviewData,
				};
			},
			deleteOne: mockReviewDeleteOne,
		};
	});

	return {
		mockUserModel,
		mockReviewModel,
		mockUserFindOne: vi.fn(),
		mockUserFindById: vi.fn(),
		mockReviewFind: vi.fn(),
		mockReviewFindById: vi.fn(),
		mockReviewDeleteMany: vi.fn(),
		mockUserSave,
		mockReviewSave,
		mockReviewDeleteOne,
		mockGenerateToken: vi.fn(),
		mockSendVerificationMail: vi.fn(),
		mockSendPasswordResetMail: vi.fn(),
		mockHash: vi.fn(),
		mockGenSalt: vi.fn(),
		mockCompare: vi.fn(),
		mockVerify: vi.fn(),
		mockGroqReview: vi.fn(),
		mockAxiosPost: vi.fn(),
	};
});

vi.mock('../models/User.js', () => ({
	default: Object.assign(mockUserModel, {
		findOne: mockUserFindOne,
		findById: mockUserFindById,
	}),
}));

vi.mock('../models/Review.js', () => ({
	default: Object.assign(mockReviewModel, {
		find: mockReviewFind,
		findById: mockReviewFindById,
		deleteMany: mockReviewDeleteMany,
	}),
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

vi.mock('axios', () => ({
	default: {
		post: mockAxiosPost,
	},
}));

vi.mock('../lib/groq.js', () => ({
	getReviewFromGroq: mockGroqReview,
}));

import app from '../app.js';

function clearMocks() {
	vi.clearAllMocks();
	mockGenSalt.mockResolvedValue('salt');
	mockHash.mockResolvedValue('hashed-password');
	mockCompare.mockResolvedValue(true);
	mockVerify.mockReturnValue({ userId: 'user-1' });
	mockGroqReview.mockResolvedValue([
		'ISSUE: insecure input handling',
		'ISSUE: slow loop',
	]);
	mockAxiosPost.mockResolvedValue({ data: { category: 'security' } });
	mockGenerateToken.mockImplementation((_userId, res) => {
		res.cookie('jwt', 'mock-jwt', { httpOnly: true });
	});
}

beforeEach(() => {
	clearMocks();
});

describe('backend integration tests', () => {
	it('registers a new user and sends verification mail', async () => {
		mockUserFindOne.mockResolvedValue(null);
		mockUserSave.mockResolvedValue();
		mockSendVerificationMail.mockResolvedValue();

		const response = await request(app)
			.post('/api/auth/register')
			.send({ email: 'test@example.com', password: 'Password123!' });

		expect(response.status).toBe(201);
		expect(mockUserFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
		expect(mockSendVerificationMail).toHaveBeenCalledWith(
			'test@example.com',
			expect.any(String),
		);
		expect(response.body).toMatchObject({
			_id: 'user-1',
			email: 'test@example.com',
		});
	});

	it('logs in a verified user and sets the jwt cookie', async () => {
		mockUserFindOne.mockResolvedValue({
			_id: 'user-1',
			email: 'test@example.com',
			isVerified: true,
			password: 'hashed-password',
		});

		const response = await request(app)
			.post('/api/auth/login')
			.send({ email: 'test@example.com', password: 'Password123!' });

		expect(response.status).toBe(200);
		expect(mockCompare).toHaveBeenCalledWith('Password123!', 'hashed-password');
		expect(mockGenerateToken).toHaveBeenCalledWith(
			'user-1',
			expect.any(Object),
		);
		expect(response.headers['set-cookie'][0]).toContain('jwt=mock-jwt');
		expect(response.body).toEqual({ _id: 'user-1', email: 'test@example.com' });
	});

	it('returns the authenticated user from the protected check route', async () => {
		mockUserFindById.mockReturnValue({
			select: vi
				.fn()
				.mockReturnValue({ _id: 'user-1', email: 'test@example.com' }),
		});

		const response = await request(app)
			.get('/api/auth/check')
			.set('Cookie', ['jwt=mock-jwt']);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ _id: 'user-1', email: 'test@example.com' });
	});

	it('creates a review after calling the review and ml services', async () => {
		mockReviewSave.mockResolvedValue();
		mockGroqReview.mockResolvedValue([
			'ISSUE: insecure input handling',
			'ISSUE: slow loop',
		]);
		mockAxiosPost
			.mockResolvedValueOnce({ data: { category: 'security' } })
			.mockResolvedValueOnce({ data: { category: 'performance' } });

		const response = await request(app)
			.post('/api/review')
			.set('Cookie', ['jwt=mock-jwt'])
			.send({ code: 'function test() {}', language: 'javascript' });

		expect(response.status).toBe(201);
		expect(mockGroqReview).toHaveBeenCalledWith(
			'function test() {}',
			'javascript',
		);
		expect(mockAxiosPost).toHaveBeenCalledTimes(2);
		expect(response.body.critiquesList).toEqual([
			{ text: 'ISSUE: insecure input handling', category: 'security' },
			{ text: 'ISSUE: slow loop', category: 'performance' },
		]);
	});

	it('deletes a review owned by the logged-in user', async () => {
		mockReviewFindById.mockResolvedValue({
			userId: { toString: () => 'user-1' },
			deleteOne: mockReviewDeleteOne,
		});
		mockReviewDeleteOne.mockResolvedValue();

		const response = await request(app)
			.delete('/api/review/review-1')
			.set('Cookie', ['jwt=mock-jwt']);

		expect(response.status).toBe(200);
		expect(mockReviewDeleteOne).toHaveBeenCalled();
		expect(response.body).toEqual({ message: 'Review successfully deleted' });
	});
});
