import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { FileExplorer } from './FileExplorer';

// Mock the FileSystemService
const mockFileSystem = {
	getState: jest.fn(),
	getSelectedNode: jest.fn(),
	getRootNode: jest.fn(),
	getAllNodes: jest.fn(),
	selectNode: jest.fn(),
	createNode: jest.fn(),
	deleteNode: jest.fn(),
	generateExampleData: jest.fn(),
	createRootDirectory: jest.fn(),
};

jest.mock('../services', () => ({
	FileSystemService: jest.fn(() => mockFileSystem),
}));

// Mock components with minimal implementation
jest.mock('../components', () => ({
	Controls: ({
		onCreateRoot,
		onGenerateExampleData,
		onShowCreateDialog,
		onDeleteNode,
		onExpandAll,
		onCollapseAll,
	}: any) => (
		<div>
			<button onClick={onCreateRoot} data-testid="create-root">
				Create Root
			</button>
			<button onClick={onGenerateExampleData} data-testid="generate-example">
				Generate
			</button>
			<button onClick={onShowCreateDialog} data-testid="show-create-dialog">
				New
			</button>
			<button onClick={onDeleteNode} data-testid="delete-node">
				Delete
			</button>
			<button onClick={onExpandAll} data-testid="expand-all">
				Expand All
			</button>
			<button onClick={onCollapseAll} data-testid="collapse-all">
				Collapse All
			</button>
		</div>
	),
	CreateDialog: ({
		isOpen,
		onClose,
		onCreateNode,
		onCreateNodeTypeChange,
		onNewNodeNameChange,
	}: any) =>
		isOpen ? (
			<div data-testid="create-dialog">
				<button onClick={onClose} data-testid="close-dialog">
					Close
				</button>
				<button onClick={onCreateNode} data-testid="create-node">
					Create
				</button>
				<select
					onChange={e => onCreateNodeTypeChange(e.target.value)}
					data-testid="node-type"
				>
					<option value="file">File</option>
					<option value="directory">Directory</option>
				</select>
				<input
					onChange={e => onNewNodeNameChange(e.target.value)}
					data-testid="node-name"
				/>
			</div>
		) : null,
	EmptyState: () => <div data-testid="empty-state" />,
	ErrorDisplay: ({ error }: any) =>
		error ? <div data-testid="error">{error}</div> : null,
	Statistics: ({ nodeCount, directoryCount, fileCount }: any) => (
		<div data-testid="statistics">
			Nodes: {nodeCount}, Dirs: {directoryCount}, Files: {fileCount}
		</div>
	),
}));

jest.mock('./VirtualizedTree', () => ({
	VirtualizedTree: ({ onNodeSelect, onNodeToggle }: any) => (
		<div data-testid="tree">
			<button onClick={() => onNodeSelect('node1')} data-testid="select-node">
				Select
			</button>
			<button onClick={() => onNodeToggle('dir1')} data-testid="toggle-node">
				Toggle
			</button>
		</div>
	),
}));

describe('FileExplorer', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Set default return values
		mockFileSystem.getState.mockReturnValue({ selectedNodeId: null });
		mockFileSystem.getSelectedNode.mockReturnValue(null);
		mockFileSystem.getRootNode.mockReturnValue(null);
		mockFileSystem.getAllNodes.mockReturnValue([]);
	});

	it('renders with empty state when no root node exists', () => {
		render(<FileExplorer />);

		expect(screen.getByText('In-Browser File Explorer')).toBeInTheDocument();
		expect(screen.getByTestId('empty-state')).toBeInTheDocument();
		expect(screen.queryByTestId('tree')).not.toBeInTheDocument();
	});

	it('renders tree when root node exists', () => {
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		mockFileSystem.getAllNodes.mockReturnValue([
			{ id: 'root', name: 'Root', type: 'directory' },
		]);

		render(<FileExplorer />);

		expect(screen.getByTestId('tree')).toBeInTheDocument();
		expect(screen.getByTestId('statistics')).toBeInTheDocument();
	});

	it('creates root directory', () => {
		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('create-root'));

		expect(mockFileSystem.createRootDirectory).toHaveBeenCalledWith('Root');
	});

	it('generates example data', () => {
		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('generate-example'));

		expect(mockFileSystem.generateExampleData).toHaveBeenCalled();
	});

	it('handles node selection', () => {
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('select-node'));

		expect(mockFileSystem.selectNode).toHaveBeenCalledWith('node1');
	});

	it('displays error when service throws', () => {
		mockFileSystem.selectNode.mockImplementation(() => {
			throw new Error('Selection failed');
		});
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});

		render(<FileExplorer />);
		fireEvent.click(screen.getByTestId('select-node'));

		expect(screen.getByTestId('error')).toHaveTextContent('Selection failed');
	});

	it('displays statistics correctly', () => {
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		mockFileSystem.getAllNodes.mockReturnValue([
			{ id: 'root', type: 'directory' },
			{ id: 'file1', type: 'file' },
			{ id: 'file2', type: 'file' },
			{ id: 'dir1', type: 'directory' },
		]);

		render(<FileExplorer />);

		expect(screen.getByTestId('statistics')).toHaveTextContent(
			'Nodes: 4, Dirs: 2, Files: 2'
		);
	});

	it('handles node toggle for expand/collapse', () => {
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});

		render(<FileExplorer />);

		// Toggle should update expanded nodes state
		fireEvent.click(screen.getByTestId('toggle-node'));

		// Verify tree is still rendered (no errors occurred)
		expect(screen.getByTestId('tree')).toBeInTheDocument();
	});

	it('expands and collapses all nodes', () => {
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		mockFileSystem.getAllNodes.mockReturnValue([
			{ id: 'root', type: 'directory' },
			{ id: 'dir1', type: 'directory' },
			{ id: 'dir2', type: 'directory' },
		]);

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('expand-all'));
		fireEvent.click(screen.getByTestId('collapse-all'));

		// Verify tree is still rendered (no errors occurred)
		expect(screen.getByTestId('tree')).toBeInTheDocument();
	});

	it('opens and closes create dialog', () => {
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		mockFileSystem.getSelectedNode.mockReturnValue({
			id: 'dir1',
			type: 'directory',
		});

		render(<FileExplorer />);

		// Open dialog
		fireEvent.click(screen.getByTestId('show-create-dialog'));
		expect(screen.getByTestId('create-dialog')).toBeInTheDocument();

		// Close dialog
		fireEvent.click(screen.getByTestId('close-dialog'));
		expect(screen.queryByTestId('create-dialog')).not.toBeInTheDocument();
	});

	it('creates new file node', () => {
		const mockParent = { id: 'dir1', type: 'directory' };
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		mockFileSystem.getSelectedNode.mockReturnValue(mockParent);

		render(<FileExplorer />);

		// Open dialog and create file
		fireEvent.click(screen.getByTestId('show-create-dialog'));
		fireEvent.change(screen.getByTestId('node-name'), {
			target: { value: 'test.txt' },
		});
		fireEvent.change(screen.getByTestId('node-type'), {
			target: { value: 'file' },
		});
		fireEvent.click(screen.getByTestId('create-node'));

		expect(mockFileSystem.createNode).toHaveBeenCalledWith({
			name: 'test.txt',
			type: 'file',
			parentId: 'dir1',
		});

		// Dialog should close
		expect(screen.queryByTestId('create-dialog')).not.toBeInTheDocument();
	});

	it('creates new directory node', () => {
		const mockParent = { id: 'dir1', type: 'directory' };
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		mockFileSystem.getSelectedNode.mockReturnValue(mockParent);

		render(<FileExplorer />);

		// Open dialog and create directory
		fireEvent.click(screen.getByTestId('show-create-dialog'));
		fireEvent.change(screen.getByTestId('node-name'), {
			target: { value: 'new-folder' },
		});
		fireEvent.change(screen.getByTestId('node-type'), {
			target: { value: 'directory' },
		});
		fireEvent.click(screen.getByTestId('create-node'));

		expect(mockFileSystem.createNode).toHaveBeenCalledWith({
			name: 'new-folder',
			type: 'directory',
			parentId: 'dir1',
		});
	});

	it('shows error when creating node without directory selected', () => {
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		mockFileSystem.getSelectedNode.mockReturnValue({
			id: 'file1',
			type: 'file',
		});

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('show-create-dialog'));
		fireEvent.change(screen.getByTestId('node-name'), {
			target: { value: 'test' },
		});
		fireEvent.click(screen.getByTestId('create-node'));

		expect(screen.getByTestId('error')).toHaveTextContent(
			'Please select a directory to create a new item'
		);
		expect(mockFileSystem.createNode).not.toHaveBeenCalled();
	});

	it('shows error when creating node without name', () => {
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		mockFileSystem.getSelectedNode.mockReturnValue({
			id: 'dir1',
			type: 'directory',
		});

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('show-create-dialog'));
		fireEvent.click(screen.getByTestId('create-node'));

		expect(screen.getByTestId('error')).toHaveTextContent(
			'Please enter a name for the new item'
		);
		expect(mockFileSystem.createNode).not.toHaveBeenCalled();
	});

	it('deletes selected node', () => {
		const mockNode = { id: 'file1', type: 'file' };
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		mockFileSystem.getSelectedNode.mockReturnValue(mockNode);

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('delete-node'));

		expect(mockFileSystem.deleteNode).toHaveBeenCalledWith('file1');
	});

	it('prevents deleting root node', () => {
		const mockRoot = { id: 'root', name: 'Root', type: 'directory' };
		mockFileSystem.getRootNode.mockReturnValue(mockRoot);
		mockFileSystem.getSelectedNode.mockReturnValue(mockRoot);

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('delete-node'));

		expect(screen.getByTestId('error')).toHaveTextContent(
			'Cannot delete the root directory'
		);
		expect(mockFileSystem.deleteNode).not.toHaveBeenCalled();
	});

	it('shows error when deleting without selection', () => {
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		mockFileSystem.getSelectedNode.mockReturnValue(null);

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('delete-node'));

		expect(screen.getByTestId('error')).toHaveTextContent(
			'Please select a node to delete'
		);
		expect(mockFileSystem.deleteNode).not.toHaveBeenCalled();
	});

	it('handles create node service error', () => {
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		mockFileSystem.getSelectedNode.mockReturnValue({
			id: 'dir1',
			type: 'directory',
		});
		mockFileSystem.createNode.mockImplementation(() => {
			throw new Error('Create failed');
		});

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('show-create-dialog'));
		fireEvent.change(screen.getByTestId('node-name'), {
			target: { value: 'test' },
		});
		fireEvent.click(screen.getByTestId('create-node'));

		expect(screen.getByTestId('error')).toHaveTextContent('Create failed');
	});

	it('handles delete node service error', () => {
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		mockFileSystem.getSelectedNode.mockReturnValue({
			id: 'file1',
			type: 'file',
		});
		mockFileSystem.deleteNode.mockImplementation(() => {
			throw new Error('Delete failed');
		});

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('delete-node'));

		expect(screen.getByTestId('error')).toHaveTextContent('Delete failed');
	});

	it('handles generate example data service error', () => {
		mockFileSystem.generateExampleData.mockImplementation(() => {
			throw new Error('Generate failed');
		});

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('generate-example'));

		expect(screen.getByTestId('error')).toHaveTextContent('Generate failed');
	});

	it('clears error when successful operation occurs', () => {
		mockFileSystem.getRootNode.mockReturnValue({
			id: 'root',
			name: 'Root',
			type: 'directory',
		});
		// Start with an error
		mockFileSystem.selectNode.mockImplementationOnce(() => {
			throw new Error('Selection failed');
		});

		render(<FileExplorer />);

		// Trigger error
		fireEvent.click(screen.getByTestId('select-node'));
		expect(screen.getByTestId('error')).toHaveTextContent('Selection failed');

		// Reset mock and perform successful operation
		mockFileSystem.selectNode.mockImplementation(() => {});
		fireEvent.click(screen.getByTestId('select-node'));

		// Error should be cleared
		expect(screen.queryByTestId('error')).not.toBeInTheDocument();
	});
});
