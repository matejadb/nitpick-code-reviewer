import express from 'express';

import { protectedRoute } from '../middleware/authMiddleware.js';
import { getReviews, sendCode } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', protectedRoute, sendCode);

router.get('/', protectedRoute, getReviews);

export default router;
