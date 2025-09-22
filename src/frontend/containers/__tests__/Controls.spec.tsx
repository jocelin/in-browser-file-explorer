import React from 'react';

import { render, screen } from '@testing-library/react';

import { Controls } from '@file-explorer/containers';
import {
	FileSystemContextValue,
	useFileSystemContext,
} from '@file-explorer/contexts';
import { useSampleDataGenerator } from '@file-explorer/hooks';

// Mock hooks
jest.mock('@file-explorer/hooks', () => ({
	useSampleDataGenerator: jest.fn(),
}));

// Mock FileSystemContext
jest.mock('@file-explorer/contexts', () => ({
	useFileSystemContext: jest.fn(),
	useTreeContext: () => ({
		expandAll: jest.fn(),
		collapseAll: jest.fn(),
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
		isOpen && <div data-testid="create-dialog" />,
	ConfirmationDialog: ({ isOpen }: any) =>
		isOpen && <div data-testid="confirmation-dialog" />,
	LoadingProgress: ({ isLoading }: any) =>
		isLoading && <div data-testid="loading-progress" />,
}));

// Helper functions for mock data
const createMockNode = (
	id: string,
	name: string,
	type: 'file' | 'directory',
	parentId = '',
	children: string[] = []
) => ({
	id,
	name,
	type,
	parentId,
	children,
	createdAt: new Date(),
	modifiedAt: new Date(),
});

const createMockFileSystemContext = (overrides = {}) =>
	({
		// Only include properties actually used by Controls component
		rootNode: createMockNode('root-id', 'Root', 'directory'),
		selectedNode: null as any,
		createRoot: jest.fn(),
		createNode: jest.fn(),
		deleteNode: jest.fn(),
		allNodes: [createMockNode('root-id', 'Root', 'directory')],
		...overrides,
	}) as unknown as FileSystemContextValue;

const createMockSampleDataGenerator = (overrides = {}) => ({
	isLoading: false,
	progress: { current: 0, total: 0 },
	generateExampleData: jest.fn(),
	...overrides,
});

describe('Controls', () => {
	const mockUseSampleDataGenerator = jest.mocked(useSampleDataGenerator);
	const mockUseFileSystemContext = jest.mocked(useFileSystemContext);

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseSampleDataGenerator.mockReturnValue(createMockSampleDataGenerator());
		mockUseFileSystemContext.mockReturnValue(createMockFileSystemContext());
	});

	it('renders without crashing', () => {
		render(<Controls />);

		expect(screen.getAllByRole('button')).toHaveLength(6);
	});

	it('renders all control buttons', () => {
		render(<Controls />);

		expect(screen.getByText('➕ Create New Item')).toBeInTheDocument();
		expect(screen.getByText('🗑️ Delete Selected')).toBeInTheDocument();
		expect(screen.getByText('📂 Expand All')).toBeInTheDocument();
		expect(screen.getByText('📁 Collapse All')).toBeInTheDocument();
		expect(screen.getByText('⚡ Generate 10K Files')).toBeInTheDocument();
		expect(screen.getByText('🔄 Reset File System')).toBeInTheDocument();
	});

	it('shows selected node info when node is selected', () => {
		render(<Controls />);

		// The SelectedNodeInfo component is always rendered but shows content conditionally
		expect(screen.getByTestId('selected-node-info')).toBeInTheDocument();
	});

	it('renders all control components', () => {
		render(<Controls />);

		// Test passes if component renders without errors
		expect(screen.getAllByRole('button')).toHaveLength(6);
	});

	describe('Loading state', () => {
		it('disables all buttons when isLoading is true', () => {
			mockUseSampleDataGenerator.mockReturnValue(
				createMockSampleDataGenerator({
					isLoading: true,
					progress: { current: 50, total: 100 },
				})
			);

			render(<Controls />);

			const buttons = screen.getAllByRole('button');
			buttons.forEach(button => {
				expect(button).toBeDisabled();
			});
		});

		it('shows loading progress when isLoading is true', () => {
			mockUseSampleDataGenerator.mockReturnValue(
				createMockSampleDataGenerator({
					isLoading: true,
					progress: { current: 50, total: 100 },
				})
			);

			render(<Controls />);

			expect(screen.getByTestId('loading-progress')).toBeInTheDocument();
		});
	});

	describe('File existence validation', () => {
		it('enables Generate 10K Files button when files already exist', () => {
			const existingFile = createMockNode(
				'file-1',
				'existing-file.txt',
				'file',
				'root-id'
			);
			const rootWithFile = createMockNode('root-id', 'Root', 'directory', '', [
				'file-1',
			]);

			mockUseFileSystemContext.mockReturnValue(
				createMockFileSystemContext({
					rootNode: rootWithFile,
					allNodes: [rootWithFile, existingFile],
				})
			);

			render(<Controls />);

			const generateButton = screen.getByText('⚡ Generate 10K Files');
			expect(generateButton).not.toBeDisabled();
		});

		it('enables Generate 10K Files button when only root exists', () => {
			render(<Controls />);

			const generateButton = screen.getByText('⚡ Generate 10K Files');
			expect(generateButton).not.toBeDisabled();
		});
	});
});
