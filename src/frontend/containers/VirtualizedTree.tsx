import React, { useCallback } from 'react';
import { useFileSystemContext, useTreeContext } from '../contexts';
import { useVirtualizedTree } from '../hooks';

interface VirtualizedTreeProps {}

export const VirtualizedTree: React.FC<VirtualizedTreeProps> = () => {
	const { allNodes, rootNode, selectedNodeId, selectNode } =
		useFileSystemContext();
	const { expandedNodes, toggleNode } = useTreeContext();
	const { visibleItemsSlice, totalHeight, handleScroll, visibleRange } =
		useVirtualizedTree(allNodes, rootNode?.id || null, expandedNodes, 32, 500);

	const handleNodeClick = useCallback(
		(nodeId: string) => {
			selectNode(nodeId);
		},
		[selectNode]
	);

	const handleToggleClick = useCallback(
		(e: React.MouseEvent, nodeId: string) => {
			e.stopPropagation();
			toggleNode(nodeId);
		},
		[toggleNode]
	);

	if (!rootNode) {
		return null;
	}

	return (
		<div
			className="virtualized-tree border border-gray-300 rounded-md overflow-auto"
			style={{ height: 500 }}
			onScroll={handleScroll}
		>
			<div className="relative" style={{ height: totalHeight }}>
				{visibleItemsSlice.map((item, index) => {
					const actualIndex = visibleRange.startIndex + index;
					const top = actualIndex * 32;
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
								height: 32,
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
