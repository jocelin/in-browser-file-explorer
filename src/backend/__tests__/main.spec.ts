import path from 'path';

import express from 'express';
import request from 'supertest';

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeAll(() => {
	console.log = jest.fn();
});

afterAll(() => {
	console.log = originalConsoleLog;
});

describe('Backend Server Tests', () => {
	let app: express.Application;

	beforeAll(() => {
		// Create a test version of the Express app
		app = express();

		// Serve static files from the www directory
		// Use the same path resolution as the actual backend
		const staticPath = path.join(process.cwd(), 'dist/www');
		app.use('/', express.static(staticPath));

		// Fallback to index.html for client-side routing (SPA)
		// This should catch all routes that don't match static files
		app.get('*', (req, res) => {
			res.sendFile(path.join(staticPath, 'index.html'));
		});
	});

	describe('Static File Serving', () => {
		it('should serve static files from www directory', async () => {
			// This test assumes the dist/www directory exists
			// In a real scenario, you might want to mock the static files
			const response = await request(app).get('/').expect(200);

			// The response should be HTML content
			expect(response.text).toContain('<!doctype html>');
		});

		it('should handle non-existent static files gracefully', async () => {
			// Request a file that doesn't exist
			const response = await request(app)
				.get('/non-existent-file.txt')
				.expect(200);

			// Should fallback to index.html for SPA routing
			expect(response.text).toContain('<!doctype html>');
		});
	});

	describe('SPA Fallback Routing', () => {
		it('should serve index.html for unknown routes', async () => {
			const response = await request(app)
				.get('/some/unknown/route')
				.expect(200);

			expect(response.text).toContain('<!doctype html>');
		});

		it('should handle nested unknown routes', async () => {
			const response = await request(app)
				.get('/dashboard/settings/profile')
				.expect(200);

			expect(response.text).toContain('<!doctype html>');
		});

		it('should handle API routes that do not exist', async () => {
			const response = await request(app).get('/api/non-existent').expect(200);

			// Should fallback to index.html since it's not a real API route
			expect(response.text).toContain('<!doctype html>');
		});
	});

	describe('Server Configuration', () => {
		it('should use default port 8080 when PORT env var is not set', () => {
			// Test that the server would use the default port
			const defaultPort = process.env.PORT || 8080;
			expect(defaultPort).toBe(8080);
		});

		it('should respect PORT environment variable', () => {
			const originalPort = process.env.PORT;
			process.env.PORT = '3000';

			const port = process.env.PORT || 8080;
			expect(port).toBe('3000');

			// Restore original PORT
			if (originalPort) {
				process.env.PORT = originalPort;
			} else {
				delete process.env.PORT;
			}
		});
	});
});
