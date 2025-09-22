import React from 'react';

import { renderHook, act } from '@testing-library/react';

import { FileSystemNode } from '@file-explorer/types';

import { FileSystemProvider, useFileSystemContext } from '../FileSystemContext';

// Test wrapper that provides FileSystemProvider
const FileSystemTestWrapper: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => <FileSystemProvider>{children}</FileSystemProvider>;

describe('FileSystemContext', () => {
	it('provides initial context values', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		expect(result.current.error).toBeNull();
		expect(result.current.isLoading).toBe(false);
		expect(result.current.selectedNodeId).toBeNull();
		expect(result.current.rootNode).toBeNull();
		expect(result.current.allNodes).toEqual([]);
		expect(result.current.selectedNode).toBeNull();
		expect(typeof result.current.initializeService).toBe('function');
		expect(typeof result.current.selectNode).toBe('function');
		expect(typeof result.current.createNode).toBe('function');
		expect(typeof result.current.deleteNode).toBe('function');
		expect(typeof result.current.createRoot).toBe('function');
		expect(typeof result.current.resetFileSystem).toBe('function');
		expect(typeof result.current.setError).toBe('function');
		expect(typeof result.current.clearError).toBe('function');
	});

	it('creates a root node successfully', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		let createdNode: FileSystemNode | null = null;

		act(() => {
			createdNode = result.current.createRoot('My Root');
		});

		expect(createdNode).not.toBeNull();
		expect(createdNode?.name).toBe('My Root');
		expect(createdNode?.type).toBe('directory');
		expect(createdNode?.parentId).toBe('');
		expect(result.current.rootNode).toEqual(createdNode);
		expect(result.current.allNodes).toHaveLength(1);
		expect(result.current.error).toBeNull();
	});

	it('creates child nodes successfully', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		let rootNode: FileSystemNode | null = null;
		let childNode: FileSystemNode | null = null;

		// Create root first
		act(() => {
			rootNode = result.current.createRoot('Root');
		});

		// Create a child file
		act(() => {
			childNode = result.current.createNode({
				name: 'test.txt',
				type: 'file',
				parentId: rootNode!.id,
			});
		});

		expect(childNode).not.toBeNull();
		expect(childNode?.name).toBe('test.txt');
		expect(childNode?.type).toBe('file');
		expect(childNode?.parentId).toBe(rootNode!.id);
		expect(result.current.allNodes).toHaveLength(2);
		expect(result.current.getChildren(rootNode!.id)).toHaveLength(1);
		expect(result.current.getChildren(rootNode!.id)[0]).toEqual(childNode);
	});

	it('selects nodes correctly', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		let rootNode: FileSystemNode | null = null;

		// Create root
		act(() => {
			rootNode = result.current.createRoot('Root');
		});

		// Select the root node
		act(() => {
			result.current.selectNode(rootNode!.id);
		});

		expect(result.current.selectedNodeId).toBe(rootNode!.id);
		expect(result.current.selectedNode).toEqual(rootNode);
	});

	it('handles node selection errors', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		// Suppress console.error for this test
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		// Try to select non-existent node - should throw error
		expect(() => {
			act(() => {
				result.current.selectNode('non-existent-id');
			});
		}).toThrow('Node with id non-existent-id not found');

		expect(result.current.selectedNodeId).toBeNull();

		// Restore console.error
		consoleSpy.mockRestore();
	});

	it('deletes nodes correctly', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		let rootNode: FileSystemNode | null = null;
		let childNode: FileSystemNode | null = null;

		// Create root and child
		act(() => {
			rootNode = result.current.createRoot('Root');
			childNode = result.current.createNode({
				name: 'test.txt',
				type: 'file',
				parentId: rootNode!.id,
			});
		});

		expect(result.current.allNodes).toHaveLength(2);

		// Delete the child node
		act(() => {
			result.current.deleteNode(childNode!.id);
		});

		expect(result.current.allNodes).toHaveLength(1);
		expect(result.current.getChildren(rootNode!.id)).toHaveLength(0);
		expect(result.current.error).toBeNull();
	});

	it('prevents deletion of root node', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		// Suppress console.error for this test
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		let rootNode: FileSystemNode | null = null;

		// Create root
		act(() => {
			rootNode = result.current.createRoot('Root');
		});

		// Try to delete root
		act(() => {
			result.current.deleteNode(rootNode!.id);
		});

		expect(result.current.error).toBe('Cannot delete root node');
		expect(result.current.allNodes).toHaveLength(1); // Root still exists

		// Restore console.error
		consoleSpy.mockRestore();
	});

	it('handles deletion of non-existent nodes', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		// Suppress console.error for this test
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		// Try to delete non-existent node
		act(() => {
			result.current.deleteNode('non-existent-id');
		});

		expect(result.current.error).toBe('Node with id non-existent-id not found');

		// Restore console.error
		consoleSpy.mockRestore();
	});

	it('recursively deletes child nodes', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		let rootNode: FileSystemNode | null = null;
		let folderNode: FileSystemNode | null = null;

		// Create hierarchy: Root -> Folder -> File
		act(() => {
			rootNode = result.current.createRoot('Root');
			folderNode = result.current.createNode({
				name: 'Folder',
				type: 'directory',
				parentId: rootNode!.id,
			});
			result.current.createNode({
				name: 'file.txt',
				type: 'file',
				parentId: folderNode!.id,
			});
		});

		expect(result.current.allNodes).toHaveLength(3);

		// Delete the folder (should also delete the file)
		act(() => {
			result.current.deleteNode(folderNode!.id);
		});

		expect(result.current.allNodes).toHaveLength(1); // Only root remains
		expect(result.current.getChildren(rootNode!.id)).toHaveLength(0);
	});

	it('resets file system correctly', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		// Create some nodes
		act(() => {
			result.current.createRoot('Root');
			result.current.setError('Some error');
		});

		expect(result.current.allNodes).toHaveLength(1);
		expect(result.current.error).toBe('Some error');

		// Reset
		act(() => {
			result.current.resetFileSystem();
		});

		expect(result.current.allNodes).toHaveLength(0);
		expect(result.current.rootNode).toBeNull();
		expect(result.current.selectedNodeId).toBeNull();
		expect(result.current.error).toBeNull();
	});

	it('manages errors correctly', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		// Set an error
		act(() => {
			result.current.setError('Test error');
		});

		expect(result.current.error).toBe('Test error');

		// Clear the error
		act(() => {
			result.current.clearError();
		});

		expect(result.current.error).toBeNull();
	});

	it('handles node creation with invalid parent', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		// Suppress console.error for this test
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		// Try to create node with non-existent parent - should throw error
		expect(() => {
			act(() => {
				result.current.createNode({
					name: 'test.txt',
					type: 'file',
					parentId: 'non-existent-parent',
				});
			});
		}).toThrow('Parent node with id non-existent-parent not found');

		expect(result.current.allNodes).toHaveLength(0);

		// Restore console.error
		consoleSpy.mockRestore();
	});

	it('provides correct computed values', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		let rootNode: FileSystemNode | null = null;

		// Create nodes
		let fileNode: FileSystemNode | null = null;
		act(() => {
			rootNode = result.current.createRoot('Root');
			fileNode = result.current.createNode({
				name: 'test.txt',
				type: 'file',
				parentId: rootNode!.id,
			});
		});

		// Test getNode
		expect(result.current.getNode(rootNode!.id)).toEqual(rootNode);
		expect(result.current.getNode(fileNode!.id)).toEqual(fileNode);
		expect(result.current.getNode('non-existent')).toBeNull();

		// Test getChildren
		expect(result.current.getChildren(rootNode!.id)).toEqual([fileNode]);
		expect(result.current.getChildren(fileNode!.id)).toEqual([]);
		expect(result.current.getChildren('non-existent')).toEqual([]);
	});

	it('throws error when used outside FileSystemProvider', () => {
		// Suppress console.error for this test
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		expect(() => {
			renderHook(() => useFileSystemContext());
		}).toThrow('useFileSystemContext must be used within a FileSystemProvider');

		consoleSpy.mockRestore();
	});

	it('handles createRoot when root already exists', () => {
		const { result } = renderHook(() => useFileSystemContext(), {
			wrapper: FileSystemTestWrapper,
		});

		let firstRoot: FileSystemNode | null = null;

		// Create first root
		act(() => {
			firstRoot = result.current.createRoot('First Root');
		});

		expect(result.current.allNodes).toHaveLength(1);

		// Create second root (should reset and create new one)
		act(() => {
			result.current.createRoot('Second Root');
		});

		expect(result.current.allNodes).toHaveLength(1);
		expect(result.current.rootNode?.name).toBe('Second Root');
		expect(result.current.rootNode?.id).not.toBe(firstRoot!.id);
	});
});
