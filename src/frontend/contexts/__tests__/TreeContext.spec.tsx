import React from 'react';

import { renderHook, act } from '@testing-library/react';

import { TreeProvider, useTreeContext } from '../TreeContext';

// Mock the FileSystemContext
jest.mock('@file-explorer/contexts', () => ({
	useFileSystemContext: () => ({
		allNodes: [
			{
				id: '1',
				name: 'Root',
				type: 'directory',
				parentId: null,
				children: ['2', '3'],
				createdAt: new Date(),
				modifiedAt: new Date(),
			},
			{
				id: '2',
				name: 'File1.txt',
				type: 'file',
				parentId: '1',
				children: [],
				createdAt: new Date(),
				modifiedAt: new Date(),
			},
			{
				id: '3',
				name: 'Folder1',
				type: 'directory',
				parentId: '1',
				children: ['4'],
				createdAt: new Date(),
				modifiedAt: new Date(),
			},
			{
				id: '4',
				name: 'File2.txt',
				type: 'file',
				parentId: '3',
				children: [],
				createdAt: new Date(),
				modifiedAt: new Date(),
			},
		],
	}),
}));

// Simple test wrapper for TreeProvider
const TreeTestWrapper: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => <TreeProvider>{children}</TreeProvider>;

describe('TreeContext', () => {
	it('provides initial context values', () => {
		const { result } = renderHook(() => useTreeContext(), {
			wrapper: TreeTestWrapper,
		});

		expect(result.current.expandedNodes).toEqual(new Set());
		expect(typeof result.current.toggleNode).toBe('function');
		expect(typeof result.current.expandNode).toBe('function');
		expect(typeof result.current.expandAll).toBe('function');
		expect(typeof result.current.collapseAll).toBe('function');
	});

	it('toggles node expansion correctly', () => {
		const { result } = renderHook(() => useTreeContext(), {
			wrapper: TreeTestWrapper,
		});

		// Initially no nodes are expanded
		expect(result.current.expandedNodes.has('1')).toBe(false);

		// Toggle node 1 to expand it
		act(() => {
			result.current.toggleNode('1');
		});

		expect(result.current.expandedNodes.has('1')).toBe(true);

		// Toggle node 1 again to collapse it
		act(() => {
			result.current.toggleNode('1');
		});

		expect(result.current.expandedNodes.has('1')).toBe(false);
	});

	it('expands a single node', () => {
		const { result } = renderHook(() => useTreeContext(), {
			wrapper: TreeTestWrapper,
		});

		// Expand node 1
		act(() => {
			result.current.expandNode('1');
		});

		expect(result.current.expandedNodes.has('1')).toBe(true);
		expect(result.current.expandedNodes.has('3')).toBe(false);

		// Expand node 3 as well
		act(() => {
			result.current.expandNode('3');
		});

		expect(result.current.expandedNodes.has('1')).toBe(true);
		expect(result.current.expandedNodes.has('3')).toBe(true);
	});

	it('expands all directory nodes', () => {
		const { result } = renderHook(() => useTreeContext(), {
			wrapper: TreeTestWrapper,
		});

		// Initially no nodes are expanded
		expect(result.current.expandedNodes.size).toBe(0);

		// Expand all directories
		act(() => {
			result.current.expandAll();
		});

		// Should expand nodes 1 and 3 (both directories)
		expect(result.current.expandedNodes.has('1')).toBe(true);
		expect(result.current.expandedNodes.has('3')).toBe(true);
		expect(result.current.expandedNodes.has('2')).toBe(false); // file
		expect(result.current.expandedNodes.has('4')).toBe(false); // file
	});

	it('collapses all nodes', () => {
		const { result } = renderHook(() => useTreeContext(), {
			wrapper: TreeTestWrapper,
		});

		// First expand some nodes
		act(() => {
			result.current.expandNode('1');
			result.current.expandNode('3');
		});

		expect(result.current.expandedNodes.size).toBe(2);

		// Collapse all
		act(() => {
			result.current.collapseAll();
		});

		expect(result.current.expandedNodes.size).toBe(0);
	});

	it('throws error when used outside TreeProvider', () => {
		// Suppress console.error for this test
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		expect(() => {
			renderHook(() => useTreeContext());
		}).toThrow('useTreeContext must be used within a TreeProvider');

		consoleSpy.mockRestore();
	});

	it('handles multiple toggle operations correctly', () => {
		const { result } = renderHook(() => useTreeContext(), {
			wrapper: TreeTestWrapper,
		});

		// Toggle multiple nodes
		act(() => {
			result.current.toggleNode('1');
			result.current.toggleNode('3');
		});

		expect(result.current.expandedNodes.has('1')).toBe(true);
		expect(result.current.expandedNodes.has('3')).toBe(true);

		// Toggle one of them off
		act(() => {
			result.current.toggleNode('1');
		});

		expect(result.current.expandedNodes.has('1')).toBe(false);
		expect(result.current.expandedNodes.has('3')).toBe(true);
	});
});
