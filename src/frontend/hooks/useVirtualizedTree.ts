import React, { useState, useCallback, useMemo } from 'react';

import { FileSystemNode } from '@file-explorer/types';

// Debounce function
const debounce = <T extends (...args: never[]) => unknown>(
	func: T,
	wait: number
): ((...args: Parameters<T>) => void) => {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
};

// Get visible nodes based on expanded state
const getVisibleNodes = (
	nodes: FileSystemNode[],
	rootId: string,
	expandedNodes: Set<string>
): Array<{ node: FileSystemNode; level: number; isExpanded: boolean }> => {
	const result: Array<{
		node: FileSystemNode;
		level: number;
		isExpanded: boolean;
	}> = [];
	const nodeMap = new Map(nodes.map(node => [node.id, node]));

	const buildVisible = (nodeId: string, level: number = 0) => {
		const node = nodeMap.get(nodeId);
		if (!node) return;

		const isExpanded = expandedNodes.has(nodeId);
		result.push({ node, level, isExpanded });

		if (isExpanded && node.type === 'directory') {
			const children = node.children
				.map(childId => nodeMap.get(childId))
				.filter((child): child is FileSystemNode => child !== undefined)
				.sort((a, b) => {
					if (a.type !== b.type) {
						return a.type === 'directory' ? -1 : 1;
					}
					return a.name.localeCompare(b.name);
				});

			children.forEach(child => {
				buildVisible(child.id, level + 1);
			});
		}
	};

	buildVisible(rootId);
	return result;
};

/**
 * Hook for virtualized tree with performance optimizations
 * Handles virtualization logic for large tree views with debounced scrolling
 */
export const useVirtualizedTree = (
	nodes: FileSystemNode[],
	rootId: string | null,
	expandedNodes: Set<string>,
	itemHeight: number = 32,
	containerHeight: number = 400
) => {
	const [scrollTop, setScrollTop] = useState(0);

	// Debounced scroll handler for better performance
	const debouncedScrollHandler = useMemo(
		() =>
			debounce((scrollTop: number) => {
				setScrollTop(scrollTop);
			}, 16), // ~60fps
		[]
	);

	const handleScroll = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			const scrollTop = e.currentTarget.scrollTop;
			debouncedScrollHandler(scrollTop);
		},
		[debouncedScrollHandler]
	);

	// Memoized visible items calculation
	const visibleItems = useMemo(() => {
		if (!rootId) return [];
		return getVisibleNodes(nodes, rootId, expandedNodes);
	}, [nodes, rootId, expandedNodes]);

	// Memoized visible range calculation
	const visibleRange = useMemo(() => {
		const startIndex = Math.floor(scrollTop / itemHeight);
		const endIndex = Math.min(
			startIndex + Math.ceil(containerHeight / itemHeight) + 1,
			visibleItems.length
		);
		return { startIndex, endIndex };
	}, [scrollTop, itemHeight, containerHeight, visibleItems.length]);

	// Memoized visible items slice
	const visibleItemsSlice = useMemo(() => {
		return visibleItems.slice(visibleRange.startIndex, visibleRange.endIndex);
	}, [visibleItems, visibleRange]);

	const totalHeight = visibleItems.length * itemHeight;

	return {
		visibleItemsSlice,
		totalHeight,
		handleScroll,
		visibleRange,
	};
};
