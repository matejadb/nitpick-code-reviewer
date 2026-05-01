import express from 'express';
import {
	checkAuth,
	deleteUser,
	forgotPassword,
	login,
	logout,
	register,
	resetPassword,
	verifyEmail,
} from '../controllers/authController.js';
import { protectedRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/verify-email', verifyEmail);
router.get('/check', protectedRoute, checkAuth);

router.delete('/:id', protectedRoute, deleteUser);

export default router;
