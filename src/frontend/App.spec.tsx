import React from 'react';

import { render, screen } from '@testing-library/react';

import { App } from './App';

// Mock the components and contexts
jest.mock('@file-explorer/components', () => ({
	ErrorBoundary: ({ children }: any) => (
		<div data-testid="error-boundary">{children}</div>
	),
}));

jest.mock('@file-explorer/containers', () => ({
	FileExplorer: () => <div data-testid="file-explorer">File Explorer</div>,
}));

jest.mock('@file-explorer/contexts', () => ({
	FileSystemProvider: ({ children }: any) => (
		<div data-testid="file-system-provider">{children}</div>
	),
	useFileSystemContext: () => ({
		initializeService: jest.fn(),
	}),
}));

describe('App', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders without crashing', () => {
		render(<App name="Test App" />);

		expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
		expect(screen.getByTestId('file-system-provider')).toBeInTheDocument();
		expect(screen.getByTestId('file-explorer')).toBeInTheDocument();
	});

	it('renders with correct component structure', () => {
		render(<App name="Test App" />);

		// Verify the component hierarchy
		const errorBoundary = screen.getByTestId('error-boundary');
		const fileSystemProvider = screen.getByTestId('file-system-provider');
		const fileExplorer = screen.getByTestId('file-explorer');

		expect(errorBoundary).toContainElement(fileSystemProvider);
		expect(fileSystemProvider).toContainElement(fileExplorer);
	});

	it('accepts name prop', () => {
		render(<App name="My File Explorer" />);

		// Component should render successfully with name prop
		expect(screen.getByTestId('file-explorer')).toBeInTheDocument();
	});

	it('renders FileExplorer component', () => {
		render(<App name="Test App" />);

		expect(screen.getByText('File Explorer')).toBeInTheDocument();
	});

	it('wraps content with ErrorBoundary', () => {
		render(<App name="Test App" />);

		expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
	});

	it('wraps content with FileSystemProvider', () => {
		render(<App name="Test App" />);

		expect(screen.getByTestId('file-system-provider')).toBeInTheDocument();
	});
});
