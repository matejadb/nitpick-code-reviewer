import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['backend/src/__tests__/**/*.test.js'],
		exclude: ['frontend/e2e/**', 'node_modules/**', 'dist/**'],
	},
});
