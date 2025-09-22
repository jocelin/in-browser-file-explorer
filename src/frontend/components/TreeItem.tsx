import React, { useMemo } from 'react';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

/**
 * TreeItem CSS class constants for direct usage
 */
const TreeItemClass = {
	// Container styles
	container: {
		base: 'tree-item absolute left-0 right-0 flex items-center cursor-grab active:cursor-grabbing border-b border-gray-100 text-sm select-none group',
		selected: 'bg-gray-100 border-gray-200',
		hover: 'hover:bg-gray-50',
	},

	// Icon styles
	icon: {
		base: 'mr-2 text-base',
		selected: 'text-gray-700',
		directory: 'text-secondary-400',
		file: 'text-primary-400',
	},

	// Name styles
	name: {
		base: 'flex-1 overflow-hidden text-ellipsis whitespace-nowrap',
		selected: 'text-gray-900 font-medium',
		directoryHover: 'cursor-pointer hover:text-blue-600 hover:underline',
	},

	// Static element styles
	elements: {
		expandButton:
			'expand-button w-5 h-5 mr-1 border-none bg-transparent cursor-pointer flex items-center justify-center text-xs text-gray-600',
		spacer: 'w-6 mr-1',
		info: 'text-xs text-gray-500 ml-2 pr-2',
	},
};

interface TreeItemProps {
	item: {
		node: {
			id: string;
			name: string;
			type: 'file' | 'directory';
			children: string[];
		};
		level: number;
		isExpanded: boolean;
	};
	actualIndex: number;
	isSelected: boolean;
	onNodeClick: (nodeId: string, nodeType: string) => void;
	onToggleClick: (e: React.MouseEvent, nodeId: string) => void;
	onMoveNode?: (draggedNodeId: string, targetNodeId: string) => void;
}

export const TreeItem: React.FC<TreeItemProps> = ({
	item,
	actualIndex,
	isSelected,
	onNodeClick,
	onToggleClick,
	onMoveNode: _onMoveNode,
}) => {
	const top = actualIndex * 32;
	const itemCount = item.node.children.length;

	// Drag and drop functionality
	const {
		attributes,
		listeners,
		setNodeRef: setDraggableRef,
		transform,
		isDragging,
	} = useDraggable({
		id: item.node.id,
		data: {
			type: item.node.type,
			name: item.node.name,
		},
	});

	const { setNodeRef: setDroppableRef, isOver } = useDroppable({
		id: `drop-${item.node.id}`,
		data: {
			accepts: ['file', 'directory'],
			nodeId: item.node.id,
			nodeType: item.node.type,
		},
	});

	// Combine refs for both drag and drop
	const setRefs = (node: HTMLElement | null) => {
		setDraggableRef(node);
		setDroppableRef(node);
	};

	// Memoized class composition for better performance
	const dynamicClasses = useMemo(
		() => ({
			container: `${TreeItemClass.container.base} ${
				isSelected
					? TreeItemClass.container.selected
					: TreeItemClass.container.hover
			} ${isDragging ? 'opacity-50 scale-105 shadow-lg' : ''} ${
				isOver && item.node.type === 'directory'
					? 'bg-blue-100 border-blue-300 ring-2 ring-blue-200'
					: isOver && item.node.type === 'file'
						? 'bg-red-100 border-red-300 ring-2 ring-red-200'
						: ''
			}`,
			icon: `${TreeItemClass.icon.base} ${
				isSelected
					? TreeItemClass.icon.selected
					: item.node.type === 'directory'
						? TreeItemClass.icon.directory
						: TreeItemClass.icon.file
			}`,
			name: `${TreeItemClass.name.base} ${
				isSelected
					? TreeItemClass.name.selected
					: item.node.type === 'directory'
						? TreeItemClass.name.directoryHover
						: ''
			}`,
		}),
		[isSelected, item.node.type, isDragging, isOver]
	);

	return (
		<div
			key={item.node.id}
			ref={setRefs}
			className={dynamicClasses.container}
			style={{
				top,
				height: 32,
				paddingLeft: `${item.level * 20 + 8}px`,
				transform: CSS.Translate.toString(transform),
			}}
			onClick={() => onNodeClick(item.node.id, item.node.type)}
		>
			{/* Drag Handle */}
			<div
				className="drag-handle w-4 h-4 mr-1 cursor-move active:cursor-grabbing flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
				{...listeners}
				{...attributes}
				onClick={e => e.stopPropagation()}
				title="Drag to move"
			>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
					<circle cx="2" cy="2" r="1" />
					<circle cx="6" cy="2" r="1" />
					<circle cx="10" cy="2" r="1" />
					<circle cx="2" cy="6" r="1" />
					<circle cx="6" cy="6" r="1" />
					<circle cx="10" cy="6" r="1" />
					<circle cx="2" cy="10" r="1" />
					<circle cx="6" cy="10" r="1" />
					<circle cx="10" cy="10" r="1" />
				</svg>
			</div>

			{/* Expand/Collapse Button */}
			{item.node.type === 'directory' && (
				<button
					className={TreeItemClass.elements.expandButton}
					onClick={e => onToggleClick(e, item.node.id)}
				>
					{item.isExpanded ? '▼' : '▶'}
				</button>
			)}

			{/* Spacer for files */}
			{item.node.type === 'file' && (
				<div className={TreeItemClass.elements.spacer} />
			)}

			{/* Node Icon */}
			<span className={dynamicClasses.icon}>
				{item.node.type === 'directory' ? '📁' : '📄'}
			</span>

			{/* Node Name */}
			<span className={dynamicClasses.name}>{item.node.name}</span>

			{/* Node Info */}
			<span className={TreeItemClass.elements.info}>
				{item.node.type === 'directory' &&
					`${itemCount.toLocaleString()} ${itemCount > 1 ? 'items' : 'item'}`}
			</span>
		</div>
	);
};
