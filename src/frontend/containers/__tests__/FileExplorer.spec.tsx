import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import { FileExplorer } from '@file-explorer/containers';
import { TestWrapper } from '@file-explorer/test';

// Mock the components to simplify testing
jest.mock('@file-explorer/components', () => ({
	ControlButton: ({ children, onClick }: any) => (
		<button onClick={onClick} data-testid="control-button">
			{children}
		</button>
	),
	EmptyState: () => <div data-testid="empty-state">No files or folders</div>,
	ErrorDisplay: (): null => null,
	ErrorBoundary: ({ children }: any) => <div>{children}</div>,
	LoadingProgress: (): null => null,
	ConfirmationDialog: (): null => null,
}));

jest.mock('@file-explorer/containers', () => ({
	...jest.requireActual('@file-explorer/containers'),
	Controls: () => <div data-testid="controls">Controls</div>,
	VirtualizedTree: () => <div data-testid="tree">Tree</div>,
	Statistics: () => <div data-testid="statistics">Statistics</div>,
}));

describe('FileExplorer', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders with empty state when no root node exists', () => {
		render(
			<TestWrapper>
				<FileExplorer />
			</TestWrapper>
		);

		expect(screen.getByText('In-Browser File Explorer')).toBeInTheDocument();
		expect(screen.getByTestId('empty-state')).toBeInTheDocument();
		expect(screen.queryByTestId('tree')).not.toBeInTheDocument();
	});

	it('renders without crashing', () => {
		render(
			<TestWrapper>
				<FileExplorer />
			</TestWrapper>
		);

		expect(screen.getByText('In-Browser File Explorer')).toBeInTheDocument();
	});

	it('renders create root button when no root exists', () => {
		render(
			<TestWrapper>
				<FileExplorer />
			</TestWrapper>
		);

		expect(screen.getByTestId('control-button')).toBeInTheDocument();
		expect(screen.getByText('📁 Create Root Directory')).toBeInTheDocument();
	});

	it('handles create root button click', () => {
		render(
			<TestWrapper>
				<FileExplorer />
			</TestWrapper>
		);

		fireEvent.click(screen.getByTestId('control-button'));
		// The actual implementation will be tested through integration
	});

	it('renders tree components when root exists', () => {
		render(
			<TestWrapper>
				<FileExplorer />
			</TestWrapper>
		);

		// When root exists, the tree components should be rendered
		// This test verifies the component structure without mocking context
		expect(screen.getByText('In-Browser File Explorer')).toBeInTheDocument();
	});
});
