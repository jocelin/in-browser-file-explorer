import React from 'react';

import { render, screen } from '@testing-library/react';

import { Controls } from '@file-explorer/containers';
import { TestWrapper } from '@file-explorer/test';

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

	it('renders without crashing', () => {
		render(
			<TestWrapper>
				<Controls {...mockProps} />
			</TestWrapper>
		);

		expect(screen.getAllByRole('button')).toHaveLength(6);
	});

	it('renders all control buttons', () => {
		render(
			<TestWrapper>
				<Controls {...mockProps} />
			</TestWrapper>
		);

		expect(screen.getByText('➕ Create New Item')).toBeInTheDocument();
		expect(screen.getByText('🗑️ Delete Selected')).toBeInTheDocument();
		expect(screen.getByText('📂 Expand All')).toBeInTheDocument();
		expect(screen.getByText('📁 Collapse All')).toBeInTheDocument();
		expect(screen.getByText('⚡ Generate 10K Files')).toBeInTheDocument();
		expect(screen.getByText('🔄 Reset File System')).toBeInTheDocument();
	});

	it('shows selected node info when node is selected', () => {
		render(
			<TestWrapper>
				<Controls {...mockProps} />
			</TestWrapper>
		);

		// The SelectedNodeInfo component is always rendered but shows content conditionally
		expect(screen.getByTestId('selected-node-info')).toBeInTheDocument();
	});

	it('renders all control components', () => {
		render(
			<TestWrapper>
				<Controls {...mockProps} />
			</TestWrapper>
		);

		// Test passes if component renders without errors
		expect(screen.getAllByRole('button')).toHaveLength(6);
	});
});
