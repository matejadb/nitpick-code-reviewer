import express from 'express';

import { protectedRoute } from '../middleware/authMiddleware.js';
import { sendCode } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', protectedRoute, sendCode);

export default router;
