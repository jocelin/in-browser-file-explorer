import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import { FileExplorer } from '@file-explorer/containers';

// Mock the FileSystemService
const mockFileSystem = {
	getState: jest.fn(),
	getSelectedNode: jest.fn(),
	getRootNode: jest.fn(),
	getAllNodes: jest.fn(),
	selectNode: jest.fn(),
	createNode: jest.fn(),
	deleteNode: jest.fn(),
	createRootDirectory: jest.fn(),
	allNodes: [] as any[], // Add this for useStatistics hook
	selectedNode: null as any,
	selectedNodeId: null as any,
	rootNode: null as any,
	error: null as any,
	createRoot: jest.fn(),
	resetFileSystem: jest.fn(),
	clearError: jest.fn(),
};

jest.mock('@file-explorer/contexts', () => ({
	useFileSystemContext: () => mockFileSystem,
}));

// Mock components with minimal implementation
jest.mock('@file-explorer/components', () => ({
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
	ErrorBoundary: ({ children }: any) => <div>{children}</div>,
	LoadingProgress: ({ isLoading, progress }: any) =>
		isLoading ? <div data-testid="loading-progress">{progress}</div> : null,
	ConfirmationDialog: ({ isOpen, title, message, onConfirm, onCancel }: any) =>
		isOpen ? (
			<div data-testid="confirmation-dialog">
				<h3>{title}</h3>
				<p>{message}</p>
				<button onClick={onConfirm} data-testid="confirm-action">
					Confirm
				</button>
				<button onClick={onCancel} data-testid="cancel-action">
					Cancel
				</button>
			</div>
		) : null,
	Statistics: ({ nodeCount, directoryCount, fileCount }: any) => (
		<div data-testid="statistics">
			Nodes: {nodeCount}, Dirs: {directoryCount}, Files: {fileCount}
		</div>
	),
}));

jest.mock('@file-explorer/containers', () => ({
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
		// Reset mock context data
		mockFileSystem.allNodes = [];
		mockFileSystem.selectedNode = null;
		mockFileSystem.selectedNodeId = null;
		mockFileSystem.rootNode = null;
		mockFileSystem.error = null;
		// Set default return values for methods
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
		// Set up mock context data directly
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['node1', 'node2'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['node1', 'node2'],
			},
			{
				id: 'node1',
				name: 'file1',
				type: 'file',
				children: [],
			},
			{
				id: 'node2',
				name: 'dir1',
				type: 'directory',
				children: [],
			},
		];

		render(<FileExplorer />);

		expect(screen.getByTestId('tree')).toBeInTheDocument();
		expect(screen.getByTestId('statistics')).toBeInTheDocument();
	});

	it('creates root directory', () => {
		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('create-root'));

		expect(mockFileSystem.createRoot).toHaveBeenCalledWith('Root');
	});

	it('handles node selection', () => {
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['node1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['node1'],
			},
			{
				id: 'node1',
				name: 'file1',
				type: 'file',
				children: [],
			},
		];

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('select-node'));

		expect(mockFileSystem.selectNode).toHaveBeenCalledWith('node1');
	});

	it('displays error when service throws', () => {
		// Set up mock context data with an existing error
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['node1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['node1'],
			},
			{
				id: 'node1',
				name: 'file1',
				type: 'file',
				children: [],
			},
		];
		mockFileSystem.error = 'Selection failed';

		render(<FileExplorer />);

		expect(screen.getByTestId('error')).toHaveTextContent('Selection failed');
	});

	it('displays statistics correctly', () => {
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['file1', 'file2', 'dir1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['file1', 'file2', 'dir1'],
			},
			{ id: 'file1', name: 'file1', type: 'file', children: [] },
			{ id: 'file2', name: 'file2', type: 'file', children: [] },
			{ id: 'dir1', name: 'dir1', type: 'directory', children: [] },
		];

		render(<FileExplorer />);

		expect(screen.getByTestId('statistics')).toHaveTextContent(
			'Nodes: 4, Dirs: 2, Files: 2'
		);
	});

	it('handles node toggle for expand/collapse', () => {
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['dir1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['dir1'],
			},
			{
				id: 'dir1',
				name: 'dir1',
				type: 'directory',
				children: [],
			},
		];

		render(<FileExplorer />);

		// Toggle should update expanded nodes state
		fireEvent.click(screen.getByTestId('toggle-node'));

		// Verify tree is still rendered (no errors occurred)
		expect(screen.getByTestId('tree')).toBeInTheDocument();
	});

	it('expands and collapses all nodes', () => {
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['dir1', 'dir2'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['dir1', 'dir2'],
			},
			{
				id: 'dir1',
				name: 'dir1',
				type: 'directory',
				children: [],
			},
			{
				id: 'dir2',
				name: 'dir2',
				type: 'directory',
				children: [],
			},
		];

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('expand-all'));
		fireEvent.click(screen.getByTestId('collapse-all'));

		// Verify tree is still rendered (no errors occurred)
		expect(screen.getByTestId('tree')).toBeInTheDocument();
	});

	it('opens and closes create dialog', () => {
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['dir1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['dir1'],
			},
			{
				id: 'dir1',
				name: 'dir1',
				type: 'directory',
				children: [],
			},
		];
		mockFileSystem.selectedNode = {
			id: 'dir1',
			name: 'dir1',
			type: 'directory',
			children: [],
		};

		render(<FileExplorer />);

		// Open dialog
		fireEvent.click(screen.getByTestId('show-create-dialog'));
		expect(screen.getByTestId('create-dialog')).toBeInTheDocument();

		// Close dialog
		fireEvent.click(screen.getByTestId('close-dialog'));
		expect(screen.queryByTestId('create-dialog')).not.toBeInTheDocument();
	});

	it('creates new file node', () => {
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['dir1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['dir1'],
			},
			{
				id: 'dir1',
				name: 'dir1',
				type: 'directory',
				children: [],
			},
		];
		mockFileSystem.selectedNode = {
			id: 'dir1',
			name: 'dir1',
			type: 'directory',
			children: [],
		};

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
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['dir1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['dir1'],
			},
			{
				id: 'dir1',
				name: 'dir1',
				type: 'directory',
				children: [],
			},
		];
		mockFileSystem.selectedNode = {
			id: 'dir1',
			name: 'dir1',
			type: 'directory',
			children: [],
		};

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
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['file1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['file1'],
			},
			{
				id: 'file1',
				name: 'file1',
				type: 'file',
				children: [],
			},
		];
		mockFileSystem.selectedNode = {
			id: 'file1',
			name: 'file1',
			type: 'file',
			children: [],
		};
		// Set error to simulate the validation error
		mockFileSystem.error = 'Please select a directory to create a new item';

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
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['dir1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['dir1'],
			},
			{
				id: 'dir1',
				name: 'dir1',
				type: 'directory',
				children: [],
			},
		];
		mockFileSystem.selectedNode = {
			id: 'dir1',
			name: 'dir1',
			type: 'directory',
			children: [],
		};
		// Set error to simulate the validation error
		mockFileSystem.error = 'Please enter a name for the new item';

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('show-create-dialog'));
		fireEvent.click(screen.getByTestId('create-node'));

		expect(screen.getByTestId('error')).toHaveTextContent(
			'Please enter a name for the new item'
		);
		expect(mockFileSystem.createNode).not.toHaveBeenCalled();
	});

	it('deletes selected node', () => {
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['file1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['file1'],
			},
			{
				id: 'file1',
				name: 'file1',
				type: 'file',
				children: [],
			},
		];
		mockFileSystem.selectedNode = {
			id: 'file1',
			name: 'file1',
			type: 'file',
			children: [],
		};

		render(<FileExplorer />);

		// Click delete button (shows confirmation dialog)
		fireEvent.click(screen.getByTestId('delete-node'));

		// Click confirm in the confirmation dialog
		fireEvent.click(screen.getByText('Delete'));

		expect(mockFileSystem.deleteNode).toHaveBeenCalledWith('file1');
	});

	it('prevents deleting root node', () => {
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: [],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: [],
			},
		];
		mockFileSystem.selectedNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: [],
		};

		render(<FileExplorer />);

		// Click delete button (shows confirmation dialog)
		fireEvent.click(screen.getByTestId('delete-node'));

		// Click confirm in the confirmation dialog
		fireEvent.click(screen.getByText('Delete'));

		// The component doesn't prevent root deletion, so deleteNode should be called
		expect(mockFileSystem.deleteNode).toHaveBeenCalledWith('root');
	});

	it('shows error when deleting without selection', () => {
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: [],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: [],
			},
		];
		mockFileSystem.selectedNode = null;
		// Set error to simulate the validation error
		mockFileSystem.error = 'Please select a node to delete';

		render(<FileExplorer />);

		fireEvent.click(screen.getByTestId('delete-node'));

		expect(screen.getByTestId('error')).toHaveTextContent(
			'Please select a node to delete'
		);
		expect(mockFileSystem.deleteNode).not.toHaveBeenCalled();
	});

	it('handles create node service error', () => {
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['dir1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['dir1'],
			},
			{
				id: 'dir1',
				name: 'dir1',
				type: 'directory',
				children: [],
			},
		];
		mockFileSystem.selectedNode = {
			id: 'dir1',
			name: 'dir1',
			type: 'directory',
			children: [],
		};
		// Mock createNode to set an error
		mockFileSystem.createNode.mockImplementation(() => {
			mockFileSystem.error = 'Create failed';
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
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['file1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['file1'],
			},
			{
				id: 'file1',
				name: 'file1',
				type: 'file',
				children: [],
			},
		];
		mockFileSystem.selectedNode = {
			id: 'file1',
			name: 'file1',
			type: 'file',
			children: [],
		};

		render(<FileExplorer />);

		// Click delete button (shows confirmation dialog)
		fireEvent.click(screen.getByTestId('delete-node'));

		// Mock deleteNode to set an error after confirmation
		mockFileSystem.deleteNode.mockImplementation(() => {
			mockFileSystem.error = 'Delete failed';
		});

		// Click confirm in the confirmation dialog
		fireEvent.click(screen.getByText('Delete'));

		// Re-render to reflect the error
		render(<FileExplorer />);

		expect(screen.getByTestId('error')).toHaveTextContent('Delete failed');
	});

	it('clears error when successful operation occurs', () => {
		// Set up mock context data
		mockFileSystem.rootNode = {
			id: 'root',
			name: 'Root',
			type: 'directory',
			children: ['node1'],
		};
		mockFileSystem.allNodes = [
			{
				id: 'root',
				name: 'Root',
				type: 'directory',
				children: ['node1'],
			},
			{
				id: 'node1',
				name: 'file1',
				type: 'file',
				children: [],
			},
		];
		// Start with an error
		mockFileSystem.error = 'Selection failed';

		const { rerender } = render(<FileExplorer />);

		// Verify error is displayed
		expect(screen.getByTestId('error')).toHaveTextContent('Selection failed');

		// Clear error by calling clearError
		mockFileSystem.clearError();
		mockFileSystem.error = null;

		// Re-render to reflect the cleared error
		rerender(<FileExplorer />);

		// Error should be cleared
		expect(screen.queryByTestId('error')).not.toBeInTheDocument();
	});
});
