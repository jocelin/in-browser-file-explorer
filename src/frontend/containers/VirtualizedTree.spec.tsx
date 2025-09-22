import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import { VirtualizedTree } from '@file-explorer/containers';
import { FileSystemNode } from '@file-explorer/types';

const mockNodes: FileSystemNode[] = [
	{
		id: 'root',
		name: 'Root',
		type: 'directory',
		parentId: null,
		children: ['dir1', 'file1'],
		createdAt: new Date('2024-01-01'),
		modifiedAt: new Date('2024-01-01'),
	},
	{
		id: 'dir1',
		name: 'Directory 1',
		type: 'directory',
		parentId: 'root',
		children: ['file2'],
		createdAt: new Date('2024-01-01'),
		modifiedAt: new Date('2024-01-01'),
	},
	{
		id: 'file1',
		name: 'file1.txt',
		type: 'file',
		parentId: 'root',
		children: [],
		createdAt: new Date('2024-01-01'),
		modifiedAt: new Date('2024-01-01'),
	},
	{
		id: 'file2',
		name: 'file2.js',
		type: 'file',
		parentId: 'dir1',
		children: [],
		createdAt: new Date('2024-01-01'),
		modifiedAt: new Date('2024-01-01'),
	},
];

const defaultProps = {
	nodes: mockNodes,
	rootId: 'root',
	selectedNodeId: null as string | null,
};

describe('VirtualizedTree', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders root node', () => {
		render(<VirtualizedTree {...defaultProps} />);
		expect(screen.getByText('Root')).toBeInTheDocument();
	});

	it('shows expand button for directories', () => {
		render(<VirtualizedTree {...defaultProps} />);
		const expandButton = screen.getByText('▶');
		expect(expandButton).toBeInTheDocument();
	});

	it('expands directory when expanded set includes node', () => {
		render(<VirtualizedTree {...defaultProps} />);

		expect(screen.getByText('Directory 1')).toBeInTheDocument();
		expect(screen.getByText('file1.txt')).toBeInTheDocument();
		expect(screen.getByText('▼')).toBeInTheDocument(); // collapsed arrow
	});

	it('calls onNodeSelect when node is clicked', () => {
		const onNodeSelect = jest.fn();
		render(<VirtualizedTree {...defaultProps} />);

		fireEvent.click(screen.getByText('Root'));
		expect(onNodeSelect).toHaveBeenCalledWith('root');
	});

	it('calls onNodeToggle when expand button is clicked', () => {
		const onNodeToggle = jest.fn();
		render(<VirtualizedTree {...defaultProps} />);

		fireEvent.click(screen.getByText('▶'));
		expect(onNodeToggle).toHaveBeenCalledWith('root');
	});

	it('highlights selected node', () => {
		render(<VirtualizedTree {...defaultProps} />);
		const rootElement = screen.getByText('Root').closest('.tree-item');
		expect(rootElement).toHaveClass('selected');
	});

	it('shows item count for directories', () => {
		render(<VirtualizedTree {...defaultProps} />);

		expect(screen.getByText('2 items')).toBeInTheDocument(); // root has 2 children
		expect(screen.getByText('1 item')).toBeInTheDocument(); // dir1 has 1 child
	});

	it('renders with custom container height', () => {
		const { container } = render(<VirtualizedTree {...defaultProps} />);
		const treeContainer = container.querySelector('.virtualized-tree');
		expect(treeContainer).toHaveStyle('height: 300px');
	});

	it('handles empty nodes array', () => {
		render(<VirtualizedTree {...defaultProps} />);
		expect(screen.queryByText('Root')).not.toBeInTheDocument();
	});

	it('handles null rootId', () => {
		render(<VirtualizedTree {...defaultProps} />);
		expect(screen.queryByText('Root')).not.toBeInTheDocument();
	});
});
