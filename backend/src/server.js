import './lib/env.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import reviewRoutes from './routes/review.js';

import connectDB from './lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));
app.get('/{*path}', (_req, res) => {
	res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server is running on PORT: ${PORT}`);
	connectDB();
});
