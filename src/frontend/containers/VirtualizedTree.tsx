import React, { useCallback } from 'react';

import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	closestCenter,
} from '@dnd-kit/core';

import { TreeItem } from '@file-explorer/components';
import { useFileSystemContext, useTreeContext } from '@file-explorer/contexts';
import { useVirtualizedTree } from '@file-explorer/hooks';

interface VirtualizedTreeProps {}

export const VirtualizedTree: React.FC<VirtualizedTreeProps> = () => {
	const { allNodes, rootNode, selectedNodeId, selectNode, moveNode } =
		useFileSystemContext();
	const { expandedNodes, toggleNode } = useTreeContext();
	const { visibleItemsSlice, totalHeight, handleScroll, visibleRange } =
		useVirtualizedTree(allNodes, rootNode?.id || null, expandedNodes, 32, 500);

	// Drag and drop state
	const [activeId, setActiveId] = React.useState<string | null>(null);

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

	const handleDragStart = useCallback((event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	}, []);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;

			if (!over) {
				setActiveId(null);
				return;
			}

			const draggedNodeId = active.id as string;
			const targetDropId = over.id as string;

			// Extract the actual node ID from the drop ID (format: "drop-{nodeId}")
			const targetNodeId = targetDropId.replace('drop-', '');

			// Only move if it's a different node and target is a directory
			if (draggedNodeId !== targetNodeId) {
				const targetNode = allNodes.find(node => node.id === targetNodeId);
				if (targetNode && targetNode.type === 'directory') {
					moveNode(draggedNodeId, targetNodeId);
				}
			}

			setActiveId(null);
		},
		[allNodes, moveNode]
	);

	const handleMoveNode = useCallback(
		(draggedNodeId: string, targetNodeId: string) => {
			moveNode(draggedNodeId, targetNodeId);
		},
		[moveNode]
	);

	if (!rootNode) {
		return null;
	}

	// Find the active dragged item for the overlay
	const activeItem = activeId
		? visibleItemsSlice.find(item => item.node.id === activeId)
		: null;

	return (
		<DndContext
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
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
								onMoveNode={handleMoveNode}
							/>
						);
					})}
				</div>
			</div>

			<DragOverlay>
				{activeItem ? (
					<div className="bg-white border border-gray-300 rounded px-3 py-1 shadow-lg flex items-center">
						<span className="mr-2">
							{activeItem.node.type === 'directory' ? '📁' : '📄'}
						</span>
						<span className="text-sm">{activeItem.node.name}</span>
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
};
