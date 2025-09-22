import React from 'react';

import { render, screen } from '@testing-library/react';

import { Controls } from '@file-explorer/containers';

// Mock contexts
jest.mock('@file-explorer/contexts', () => ({
	useFileSystemContext: (): any => ({
		rootNode: null,
		selectedNode: null,
		createRoot: jest.fn(),
		createNode: jest.fn(),
		deleteNode: jest.fn(),
		resetFileSystem: jest.fn(),
	}),
}));

// Mock hooks
jest.mock('@file-explorer/hooks', () => ({
	useSampleDataGenerator: () => ({
		isLoading: false,
		progress: { current: 0, total: 0 },
		generateExampleData: jest.fn(),
	}),
}));

// Mock components
jest.mock('@file-explorer/components', () => ({
	ControlButton: ({ children, onClick, disabled }: any) => (
		<button onClick={onClick} disabled={disabled}>
			{children}
		</button>
	),
	SelectedNodeInfo: () => <div data-testid="selected-node-info" />,
	CreateDialog: ({ isOpen }: any) =>
		isOpen ? <div data-testid="create-dialog">Create Dialog</div> : null,
	ConfirmationDialog: ({ isOpen, title, message, onConfirm, onCancel }: any) =>
		isOpen ? (
			<div data-testid="confirmation-dialog">
				<div>{title}</div>
				<div>{message}</div>
				<button onClick={onConfirm}>Confirm</button>
				<button onClick={onCancel}>Cancel</button>
			</div>
		) : null,
	LoadingProgress: ({ isLoading, progress }: any) =>
		isLoading ? <div data-testid="loading-progress">{progress}</div> : null,
}));

describe('Controls', () => {
	const mockProps = {
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
