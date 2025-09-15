import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const rootElem = document.getElementById('main');
if (!rootElem) {
	throw new Error('Root element not found');
}
const root = createRoot(rootElem);
root.render(<App name="File Explorer" />);
