import { renderHook, act } from '@testing-library/react';

import { useFileSystemContext } from '@file-explorer/contexts';
import { useSampleDataGenerator } from '@file-explorer/hooks';

// Mock the useFileSystemContext hook
jest.mock('@file-explorer/contexts', () => ({
	useFileSystemContext: jest.fn(),
}));

describe('useSampleDataGenerator', () => {
	const mockUseFileSystemContext = jest.mocked(useFileSystemContext);
	const mockSetError = jest.fn();
	const mockClearError = jest.fn();
	const mockSelectNode = jest.fn();
	const mockCreateNode = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseFileSystemContext.mockReturnValue({
			error: null,
			isLoading: false,
			initializeService: jest.fn(),
			selectNode: mockSelectNode,
			createNode: mockCreateNode,
			deleteNode: jest.fn(),
			createRoot: jest.fn().mockReturnValue({
				id: 'root-id',
				name: 'Root',
				type: 'directory',
				parentId: '',
				children: [] as string[],
				createdAt: new Date(),
				modifiedAt: new Date(),
			}),
			resetFileSystem: jest.fn(),
			setError: mockSetError,
			clearError: mockClearError,
			selectedNode: null,
			selectedNodeId: null,
			rootNode: {
				id: 'root-id',
				name: 'Root',
				type: 'directory',
				parentId: '',
				children: [] as string[],
				createdAt: new Date(),
				modifiedAt: new Date(),
			},
			allNodes: [
				{
					id: 'root-id',
					name: 'Root',
					type: 'directory',
					parentId: '',
					children: [] as string[],
					createdAt: new Date(),
					modifiedAt: new Date(),
				},
			],
			getChildren: jest.fn(),
			getNode: jest.fn().mockReturnValue({
				id: 'root-id',
				name: 'Root',
				type: 'directory',
				parentId: '',
				children: [] as string[],
				createdAt: new Date(),
				modifiedAt: new Date(),
			}),
		});
	});

	it('should provide generateExampleData function', () => {
		const { result } = renderHook(() => useSampleDataGenerator(null));

		expect(result.current.generateExampleData).toBeDefined();
		expect(typeof result.current.generateExampleData).toBe('function');
	});

	it('should call generateExampleData without errors when only root exists', async () => {
		// Mock createNode to return a valid node
		mockCreateNode.mockReturnValue({
			id: 'new-node-id',
			name: 'New Node',
			type: 'file',
			parentId: 'root-id',
			children: [] as string[],
			createdAt: new Date(),
			modifiedAt: new Date(),
		});

		const { result } = renderHook(() =>
			useSampleDataGenerator({
				id: 'root-id',
				name: 'Root',
				type: 'directory',
				parentId: '',
				children: [] as string[],
				createdAt: new Date(),
				modifiedAt: new Date(),
			})
		);

		await act(async () => {
			await result.current.generateExampleData();
		});

		expect(mockSelectNode).toHaveBeenCalledWith('root-id');
		expect(mockClearError).toHaveBeenCalled();
	});

	it('should set error when no root node is available', async () => {
		const { result } = renderHook(() => useSampleDataGenerator(null));

		await act(async () => {
			await result.current.generateExampleData();
		});

		expect(mockSetError).toHaveBeenCalledWith('No root node available');
	});

	it('should set error when files already exist', async () => {
		mockUseFileSystemContext.mockReturnValue({
			error: null,
			isLoading: false,
			initializeService: jest.fn(),
			selectNode: mockSelectNode,
			createNode: mockCreateNode,
			deleteNode: jest.fn(),
			createRoot: jest.fn(),
			resetFileSystem: jest.fn(),
			setError: mockSetError,
			clearError: mockClearError,
			selectedNode: null,
			selectedNodeId: null,
			rootNode: {
				id: 'root-id',
				name: 'Root',
				type: 'directory',
				parentId: '',
				children: ['file-1'],
				createdAt: new Date(),
				modifiedAt: new Date(),
			},
			allNodes: [
				{
					id: 'root-id',
					name: 'Root',
					type: 'directory',
					parentId: '',
					children: ['file-1'],
					createdAt: new Date(),
					modifiedAt: new Date(),
				},
				{
					id: 'file-1',
					name: 'existing-file.txt',
					type: 'file',
					parentId: 'root-id',
					children: [],
					createdAt: new Date(),
					modifiedAt: new Date(),
				},
			],
			getChildren: jest.fn(),
			getNode: jest.fn(),
		});

		const { result } = renderHook(() =>
			useSampleDataGenerator({
				id: 'root-id',
				name: 'Root',
				type: 'directory',
				parentId: '',
				children: ['file-1'],
				createdAt: new Date(),
				modifiedAt: new Date(),
			})
		);

		await act(async () => {
			await result.current.generateExampleData();
		});

		expect(mockSetError).toHaveBeenCalledWith(
			'Cannot generate example data when there are existing files or directories. Please reset the file system first.'
		);
		expect(mockSelectNode).not.toHaveBeenCalled();
		expect(mockCreateNode).not.toHaveBeenCalled();
	});

	it('should handle errors during data generation', async () => {
		mockCreateNode.mockImplementation(() => {
			throw new Error('Failed to create node');
		});

		const { result } = renderHook(() =>
			useSampleDataGenerator({
				id: 'root-id',
				name: 'Root',
				type: 'directory',
				parentId: '',
				children: [] as string[],
				createdAt: new Date(),
				modifiedAt: new Date(),
			})
		);

		await act(async () => {
			await result.current.generateExampleData();
		});

		expect(mockSetError).toHaveBeenCalledWith('Failed to create node');
	});
});
