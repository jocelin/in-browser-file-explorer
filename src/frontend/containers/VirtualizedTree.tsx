import React, { useCallback } from 'react';

import { TreeItem } from '@file-explorer/components';
import { useFileSystemContext, useTreeContext } from '@file-explorer/contexts';
import { useVirtualizedTree } from '@file-explorer/hooks';

interface VirtualizedTreeProps {}

export const VirtualizedTree: React.FC<VirtualizedTreeProps> = () => {
	const { allNodes, rootNode, selectedNodeId, selectNode } =
		useFileSystemContext();
	const { expandedNodes, toggleNode } = useTreeContext();
	const { visibleItemsSlice, totalHeight, handleScroll, visibleRange } =
		useVirtualizedTree(allNodes, rootNode?.id || null, expandedNodes, 32, 500);

	const handleNodeClick = useCallback(
		(nodeId: string, nodeType: string) => {
			selectNode(nodeId);
			// If it's a directory, also toggle its expansion
			if (nodeType === 'directory') {
				toggleNode(nodeId);
			}
		},
		[selectNode, toggleNode]
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
					const isSelected = selectedNodeId === item.node.id;

					return (
						<TreeItem
							key={item.node.id}
							item={item}
							actualIndex={actualIndex}
							isSelected={isSelected}
							onNodeClick={handleNodeClick}
							onToggleClick={handleToggleClick}
						/>
					);
				})}
			</div>
		</div>
	);
};
