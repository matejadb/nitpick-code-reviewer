import express from 'express';

import { protectedRoute } from '../middleware/authMiddleware.js';
import {
	deleteReview,
	getReviews,
	sendCode,
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', protectedRoute, sendCode);

router.get('/', protectedRoute, getReviews);

router.delete('/:id', protectedRoute, deleteReview);

export default router;
