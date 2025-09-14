/**
 * @deprecated This is a legacy version of the backend for Webpack compatibility.
 * Use src/backend/main.ts for the modern setup.
 */

import * as express from 'express';
import * as path from 'path';

const app = express();

// Simple endpoint that returns the current time
app.get('/api/time', function (req, res) {
	res.send(new Date().toISOString());
});

// Serve static files
app.use('/', express.static(path.join(__dirname, '/www')));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
