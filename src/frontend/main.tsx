import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const rootElem = document.getElementById('main');
if (!rootElem) {
	throw new Error('Root element not found');
}
const root = createRoot(rootElem);
root.render(<App name="Hello World" />);
