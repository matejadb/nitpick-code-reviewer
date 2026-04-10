import './lib/env.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import reviewRoutes from './routes/review.js';

import connectDB from './lib/db.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}),
);

app.use('/api/auth', authRoutes);
app.use('/api/review', reviewRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on PORT: ${PORT}`);
	connectDB();
});
