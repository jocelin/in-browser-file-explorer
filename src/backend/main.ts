import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Simple endpoint that returns the current time
app.get('/api/time', function (req, res) {
	res.send(new Date().toISOString());
});

// Serve static files from the www directory
// When running from dist/backend/main.ts, we need to go up one level to find www
const staticPath = path.join(__dirname, '../www');
app.use('/', express.static(staticPath));

// Fallback to index.html for client-side routing (SPA)
app.get('*', (req, res) => {
	res.sendFile(path.join(staticPath, 'index.html'));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
