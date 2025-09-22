import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	root: '.',
	publicDir: 'public',
	resolve: {
		alias: [
			{
				find: '@file-explorer/components',
				replacement: path.resolve(__dirname, './src/frontend/components'),
			},
			{
				find: '@file-explorer/containers',
				replacement: path.resolve(__dirname, './src/frontend/containers'),
			},
			{
				find: '@file-explorer/contexts',
				replacement: path.resolve(__dirname, './src/frontend/contexts'),
			},
			{
				find: '@file-explorer/hooks',
				replacement: path.resolve(__dirname, './src/frontend/hooks'),
			},
			{
				find: '@file-explorer/types',
				replacement: path.resolve(__dirname, './src/frontend/types'),
			},
			{
				find: '@file-explorer',
				replacement: path.resolve(__dirname, './src'),
			},
		],
	},
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
