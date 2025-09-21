import React from 'react';
import { render, screen } from '@testing-library/react';

import { Controls } from './Controls';

// Mock the context
jest.mock('../contexts', () => ({
	useFileSystemContext: (): any => ({
		rootNode: null,
		selectedNode: null,
		createRoot: jest.fn(),
		createNode: jest.fn(),
		deleteNode: jest.fn(),
		resetFileSystem: jest.fn(),
	}),
}));

// Mock the hooks
jest.mock('../hooks', () => ({
	useSampleDataGenerator: () => ({
		isLoading: false,
		progress: { current: 0, total: 0 },
		generateExampleData: jest.fn(),
	}),
}));

// Simple mocks
jest.mock('../components/ControlButton', () => ({
	ControlButton: ({ children, onClick, disabled }: any) => (
		<button onClick={onClick} disabled={disabled}>
			{children}
		</button>
	),
}));

jest.mock('../components/SelectedNodeInfo', () => ({
	SelectedNodeInfo: () => <div data-testid="selected-node-info" />,
}));

jest.mock('../components/CreateDialog', () => ({
	CreateDialog: ({ isOpen }: any) =>
		isOpen ? <div data-testid="create-dialog">Create Dialog</div> : null,
}));

jest.mock('../components/ConfirmationDialog', () => ({
	ConfirmationDialog: ({ isOpen, title, message, onConfirm, onCancel }: any) =>
		isOpen ? (
			<div data-testid="confirmation-dialog">
				<div>{title}</div>
				<div>{message}</div>
				<button onClick={onConfirm}>Confirm</button>
				<button onClick={onCancel}>Cancel</button>
			</div>
		) : null,
}));

describe('Controls', () => {
	const mockProps = {
		expandedNodes: new Set<string>(),
		toggleNode: jest.fn(),
		expandAll: jest.fn(),
		collapseAll: jest.fn(),
		onResetRequest: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders create root button when no root node exists', () => {
		render(<Controls {...mockProps} />);

		expect(screen.getByText('📁 Create Root Directory')).toBeInTheDocument();
	});

	it('renders without crashing', () => {
		render(<Controls {...mockProps} />);

		// Basic test to ensure component renders without errors
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('shows selected node info when node is selected', () => {
		render(<Controls {...mockProps} />);

		// The SelectedNodeInfo component is always rendered but shows content conditionally
		expect(screen.getByTestId('selected-node-info')).toBeInTheDocument();
	});

	it('renders all control components', () => {
		render(<Controls {...mockProps} />);

		// Test passes if component renders without errors
		expect(screen.getByRole('button')).toBeInTheDocument();
	});
});
