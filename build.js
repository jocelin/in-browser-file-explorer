#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building application...');

// Build frontend with Vite
console.log('Building frontend...l');
execSync('vite build', { stdio: 'inherit' });

// Compile backend TypeScript to JavaScript
console.log('Compiling backend...');
if (!fs.existsSync('dist')) {
	fs.mkdirSync('dist');
}

// Copy backend source and create a simple server.js that uses tsx
fs.cpSync('src/backend', 'dist/backend', { recursive: true });

// Create a simple server.js that loads the TypeScript file
const serverContent = `#!/usr/bin/env node
require('tsx/dist/register');
require('./backend/main.ts');
`;
fs.writeFileSync('dist/server.js', serverContent);

// Copy package.json to dist for production
fs.copyFileSync('package.json', 'dist/package.json');

console.log('Build complete!');
console.log('To run in production: cd dist && npm install && node server.js');
