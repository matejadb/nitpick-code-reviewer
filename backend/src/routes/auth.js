import express from 'express';
import {
	checkAuth,
	login,
	logout,
	register,
} from '../controllers/authController.js';
import { protectedRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/check', protectedRoute, checkAuth);

export default router;
