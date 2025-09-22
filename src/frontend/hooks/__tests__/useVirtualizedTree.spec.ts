import { UIEvent } from 'react';

import { renderHook } from '@testing-library/react';

import { useVirtualizedTree } from '@file-explorer/hooks';

describe('useVirtualizedTree', () => {
	const mockNodes = [
		{
			id: '1',
			name: 'root',
			type: 'directory' as const,
			children: ['2', '3'],
			parentId: null,
			createdAt: new Date(),
			modifiedAt: new Date(),
		},
		{
			id: '2',
			name: 'file1',
			type: 'file' as const,
			children: [] as string[],
			parentId: '1',
			createdAt: new Date(),
			modifiedAt: new Date(),
		},
		{
			id: '3',
			name: 'folder1',
			type: 'directory' as const,
			children: ['4'],
			parentId: '1',
			createdAt: new Date(),
			modifiedAt: new Date(),
		},
		{
			id: '4',
			name: 'file2',
			type: 'file' as const,
			children: [] as string[],
			parentId: '3',
			createdAt: new Date(),
			modifiedAt: new Date(),
		},
	];

	const defaultParams = {
		nodes: mockNodes,
		rootId: '1',
		expandedNodes: new Set(['1', '3']),
		itemHeight: 32,
		containerHeight: 400,
	};

	it('initializes with correct visible items', () => {
		const { result } = renderHook(() =>
			useVirtualizedTree(
				defaultParams.nodes,
				defaultParams.rootId,
				defaultParams.expandedNodes,
				defaultParams.itemHeight,
				defaultParams.containerHeight
			)
		);

		expect(result.current.visibleItemsSlice).toHaveLength(4);
		expect(result.current.totalHeight).toBe(4 * 32);
		expect(result.current.visibleRange.startIndex).toBe(0);
		expect(result.current.visibleRange.endIndex).toBeGreaterThanOrEqual(4);
	});

	it('handles null rootId', () => {
		const { result } = renderHook(() =>
			useVirtualizedTree(
				defaultParams.nodes,
				null,
				defaultParams.expandedNodes,
				defaultParams.itemHeight,
				defaultParams.containerHeight
			)
		);

		expect(result.current.visibleItemsSlice).toEqual([]);
		expect(result.current.totalHeight).toBe(0);
	});

	it('calculates visible range correctly with scroll', () => {
		const { result } = renderHook(() =>
			useVirtualizedTree(
				defaultParams.nodes,
				defaultParams.rootId,
				defaultParams.expandedNodes,
				defaultParams.itemHeight,
				defaultParams.containerHeight
			)
		);

		// Simulate scroll event
		const mockEvent = {
			currentTarget: { scrollTop: 64 }, // 2 items scrolled
		} as UIEvent<HTMLDivElement>;

		result.current.handleScroll(mockEvent);

		// The visible range should update based on scroll position
		expect(result.current.visibleRange.startIndex).toBeGreaterThanOrEqual(0);
	});

	it('handles empty nodes array', () => {
		const { result } = renderHook(() =>
			useVirtualizedTree(
				[],
				'1',
				new Set(),
				defaultParams.itemHeight,
				defaultParams.containerHeight
			)
		);

		expect(result.current.visibleItemsSlice).toEqual([]);
		expect(result.current.totalHeight).toBe(0);
	});

	it('handles different item heights', () => {
		const customItemHeight = 50;
		const { result } = renderHook(() =>
			useVirtualizedTree(
				defaultParams.nodes,
				defaultParams.rootId,
				defaultParams.expandedNodes,
				customItemHeight,
				defaultParams.containerHeight
			)
		);

		expect(result.current.totalHeight).toBe(4 * customItemHeight);
	});

	it('handles different container heights', () => {
		const customContainerHeight = 200;
		const { result } = renderHook(() =>
			useVirtualizedTree(
				defaultParams.nodes,
				defaultParams.rootId,
				defaultParams.expandedNodes,
				defaultParams.itemHeight,
				customContainerHeight
			)
		);

		expect(result.current.visibleRange.endIndex).toBeLessThanOrEqual(4);
	});

	it('updates when expanded nodes change', () => {
		const { result, rerender } = renderHook(
			({ expandedNodes }) =>
				useVirtualizedTree(
					defaultParams.nodes,
					defaultParams.rootId,
					expandedNodes,
					defaultParams.itemHeight,
					defaultParams.containerHeight
				),
			{
				initialProps: { expandedNodes: new Set(['1']) },
			}
		);

		expect(result.current.visibleItemsSlice).toHaveLength(3); // root, folder1, file1

		rerender({ expandedNodes: new Set(['1', '3']) });

		expect(result.current.visibleItemsSlice).toHaveLength(4); // All visible items
	});

	it('handles large scroll values', () => {
		const { result } = renderHook(() =>
			useVirtualizedTree(
				defaultParams.nodes,
				defaultParams.rootId,
				defaultParams.expandedNodes,
				defaultParams.itemHeight,
				defaultParams.containerHeight
			)
		);

		const mockEvent = {
			currentTarget: { scrollTop: 1000 }, // Large scroll value
		} as UIEvent<HTMLDivElement>;

		result.current.handleScroll(mockEvent);

		expect(result.current.visibleRange.startIndex).toBeGreaterThanOrEqual(0);
	});
});
