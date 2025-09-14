import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	root: '.',
	publicDir: 'public',
	server: {
		port: 3000,
		strictPort: false, // Allow Vite to find another port if 3000 is busy
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
			},
		},
	},
	build: {
		outDir: 'dist/www',
		sourcemap: true,
	},
});
