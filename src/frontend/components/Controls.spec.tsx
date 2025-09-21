import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { FileSystemNode } from '../types';
import { Controls } from './Controls';

// Simple mocks
jest.mock('./ControlButton', () => ({
	ControlButton: ({ children, onClick, disabled }: any) => (
		<button onClick={onClick} disabled={disabled}>
			{children}
		</button>
	),
}));

jest.mock('./SelectedNodeInfo', () => ({
	SelectedNodeInfo: () => <div data-testid="selected-node-info" />,
}));

describe('Controls', () => {
	const rootNode: FileSystemNode = {
		id: 'root',
		name: 'Root',
		type: 'directory',
		parentId: null,
		children: ['dir1'],
		createdAt: new Date('2024-01-01'),
		modifiedAt: new Date('2024-01-01'),
	};

	const directoryNode: FileSystemNode = {
		id: 'dir1',
		name: 'Directory',
		type: 'directory',
		parentId: 'root',
		children: ['file1'],
		createdAt: new Date('2024-01-01'),
		modifiedAt: new Date('2024-01-01'),
	};

	const fileNode: FileSystemNode = {
		id: 'file1',
		name: 'file.txt',
		type: 'file',
		parentId: 'dir1',
		children: [],
		createdAt: new Date('2024-01-01'),
		modifiedAt: new Date('2024-01-01'),
	};

	const mockHandlers = {
		onCreateRoot: jest.fn(),
		onShowCreateDialog: jest.fn(),
		onDeleteNode: jest.fn(),
		onExpandAll: jest.fn(),
		onCollapseAll: jest.fn(),
		onGenerateExampleData: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('shows create root button when no root exists', () => {
		render(<Controls rootNode={null} selectedNode={null} {...mockHandlers} />);

		expect(screen.getByText('🌱 Create Root Directory')).toBeInTheDocument();
		expect(screen.queryByText('✨ Create New Item')).not.toBeInTheDocument();
	});

	it('shows all controls when root exists', () => {
		render(
			<Controls rootNode={rootNode} selectedNode={null} {...mockHandlers} />
		);

		expect(screen.getByText('✨ Create New Item')).toBeInTheDocument();
		expect(screen.getByText('🗑️ Delete Selected')).toBeInTheDocument();
		expect(screen.getByText('📂 Expand All')).toBeInTheDocument();
		expect(screen.getByText('📁 Collapse All')).toBeInTheDocument();
		expect(screen.getByText('⚡ Generate 10K Files')).toBeInTheDocument();
	});

	it('enables create button only for directories', () => {
		const { rerender } = render(
			<Controls rootNode={rootNode} selectedNode={fileNode} {...mockHandlers} />
		);

		expect(screen.getByText('✨ Create New Item')).toBeDisabled();

		rerender(
			<Controls
				rootNode={rootNode}
				selectedNode={directoryNode}
				{...mockHandlers}
			/>
		);

		expect(screen.getByText('✨ Create New Item')).not.toBeDisabled();
	});

	it('disables delete button for root node', () => {
		const { rerender } = render(
			<Controls rootNode={rootNode} selectedNode={rootNode} {...mockHandlers} />
		);

		expect(screen.getByText('🗑️ Delete Selected')).toBeDisabled();

		rerender(
			<Controls
				rootNode={rootNode}
				selectedNode={directoryNode}
				{...mockHandlers}
			/>
		);

		expect(screen.getByText('🗑️ Delete Selected')).not.toBeDisabled();
	});

	it('shows selected node info when node is selected', () => {
		const { rerender } = render(
			<Controls rootNode={rootNode} selectedNode={null} {...mockHandlers} />
		);

		expect(screen.queryByTestId('selected-node-info')).not.toBeInTheDocument();

		rerender(
			<Controls
				rootNode={rootNode}
				selectedNode={directoryNode}
				{...mockHandlers}
			/>
		);

		expect(screen.getByTestId('selected-node-info')).toBeInTheDocument();
	});

	it('calls correct handlers when buttons are clicked', () => {
		render(
			<Controls
				rootNode={rootNode}
				selectedNode={directoryNode}
				{...mockHandlers}
			/>
		);

		fireEvent.click(screen.getByText('✨ Create New Item'));
		expect(mockHandlers.onShowCreateDialog).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByText('🗑️ Delete Selected'));
		expect(mockHandlers.onDeleteNode).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByText('📂 Expand All'));
		expect(mockHandlers.onExpandAll).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByText('📁 Collapse All'));
		expect(mockHandlers.onCollapseAll).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByText('⚡ Generate 10K Files'));
		expect(mockHandlers.onGenerateExampleData).toHaveBeenCalledTimes(1);
	});

	it('calls onCreateRoot when create root button is clicked', () => {
		render(<Controls rootNode={null} selectedNode={null} {...mockHandlers} />);

		fireEvent.click(screen.getByText('🌱 Create Root Directory'));
		expect(mockHandlers.onCreateRoot).toHaveBeenCalledTimes(1);
	});
});
