import React, { useState, useMemo, useCallback } from 'react';

import { FileSystemNode } from '../types';

interface VirtualizedTreeProps {
	nodes: FileSystemNode[];
	rootId: string | null;
	selectedNodeId: string | null;
	expandedNodes: Set<string>;
	onNodeSelect: (nodeId: string) => void;
	onNodeToggle: (nodeId: string) => void;
	itemHeight?: number;
	containerHeight?: number;
}

interface VirtualizedItem {
	node: FileSystemNode;
	level: number;
	isExpanded: boolean;
	isVisible: boolean;
	index: number;
}

export const VirtualizedTree: React.FC<VirtualizedTreeProps> = ({
	nodes,
	rootId,
	selectedNodeId,
	expandedNodes,
	onNodeSelect,
	onNodeToggle,
	itemHeight = 32,
	containerHeight = 400,
}) => {
	const [scrollTop, setScrollTop] = useState(0);

	// Build flat list of visible nodes
	const visibleItems = useMemo(() => {
		if (!rootId) return [];

		const items: VirtualizedItem[] = [];
		const nodeMap = new Map(nodes.map(node => [node.id, node]));

		const buildVisibleItems = (nodeId: string, level: number = 0) => {
			const node = nodeMap.get(nodeId);
			if (!node) return;

			const isExpanded = expandedNodes.has(nodeId);
			const isVisible = level === 0 || expandedNodes.has(node.parentId || '');

			items.push({
				node,
				level,
				isExpanded,
				isVisible,
				index: items.length,
			});

			// Add children if expanded
			if (isExpanded && node.type === 'directory') {
				const children = node.children
					.map(childId => nodeMap.get(childId))
					.filter((child): child is FileSystemNode => child !== undefined)
					.sort((a, b) => {
						// Directories first, then files, then alphabetically
						if (a.type !== b.type) {
							return a.type === 'directory' ? -1 : 1;
						}
						return a.name.localeCompare(b.name);
					});

				children.forEach(child => {
					buildVisibleItems(child.id, level + 1);
				});
			}
		};

		buildVisibleItems(rootId);
		return items;
	}, [nodes, rootId, expandedNodes]);

	// Calculate visible range
	const visibleRange = useMemo(() => {
		const startIndex = Math.floor(scrollTop / itemHeight);
		const endIndex = Math.min(
			startIndex + Math.ceil(containerHeight / itemHeight) + 1,
			visibleItems.length
		);
		return { startIndex, endIndex };
	}, [scrollTop, itemHeight, containerHeight, visibleItems.length]);

	// Get visible items
	const visibleItemsSlice = useMemo(() => {
		return visibleItems.slice(visibleRange.startIndex, visibleRange.endIndex);
	}, [visibleItems, visibleRange]);

	const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
		setScrollTop(e.currentTarget.scrollTop);
	}, []);

	const handleNodeClick = useCallback(
		(nodeId: string) => {
			onNodeSelect(nodeId);
		},
		[onNodeSelect]
	);

	const handleToggleClick = useCallback(
		(e: React.MouseEvent, nodeId: string) => {
			e.stopPropagation();
			onNodeToggle(nodeId);
		},
		[onNodeToggle]
	);

	const totalHeight = visibleItems.length * itemHeight;

	return (
		<div
			className="virtualized-tree border border-gray-300 rounded-md overflow-auto"
			style={{ height: containerHeight }}
			onScroll={handleScroll}
		>
			<div className="relative" style={{ height: totalHeight }}>
				{visibleItemsSlice.map((item, index) => {
					const actualIndex = visibleRange.startIndex + index;
					const top = actualIndex * itemHeight;
					const isSelected = selectedNodeId === item.node.id;
					const itemCount = item.node.children.length;

					return (
						<div
							key={item.node.id}
							className={`tree-item absolute left-0 right-0 flex items-center cursor-pointer border-b border-gray-100 text-sm select-none ${
								isSelected ? 'selected' : ''
							}`}
							style={{
								top,
								height: itemHeight,
								paddingLeft: `${item.level * 20 + 8}px`,
							}}
							onClick={() => handleNodeClick(item.node.id)}
						>
							{/* Expand/Collapse Button */}
							{item.node.type === 'directory' && (
								<button
									className="expand-button w-5 h-5 mr-2 border-none bg-transparent cursor-pointer flex items-center justify-center text-xs text-gray-600"
									onClick={e => handleToggleClick(e, item.node.id)}
								>
									{item.isExpanded ? '▼' : '▶'}
								</button>
							)}

							{/* Spacer for files */}
							{item.node.type === 'file' && <div className="w-7 mr-2" />}

							{/* Node Icon */}
							<span
								className={`mr-2 text-base ${
									item.node.type === 'directory'
										? 'text-secondary-400'
										: 'text-primary-400'
								}`}
							>
								{item.node.type === 'directory' ? '📁' : '📄'}
							</span>

							{/* Node Name */}
							<span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
								{item.node.name}
							</span>

							{/* Node Info */}
							<span className="text-xs text-gray-500 ml-2 pr-2">
								{item.node.type === 'directory' &&
									`${itemCount.toLocaleString()} ${itemCount > 1 ? 'items' : 'item'}`}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};
