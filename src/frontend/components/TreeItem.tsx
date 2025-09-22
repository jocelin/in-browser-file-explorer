import React, { useMemo } from 'react';

/**
 * TreeItem CSS class constants for direct usage
 */
const TreeItemClass = {
	// Container styles
	container: {
		base: 'tree-item absolute left-0 right-0 flex items-center cursor-pointer border-b border-gray-100 text-sm select-none',
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
			'expand-button w-5 h-5 mr-2 border-none bg-transparent cursor-pointer flex items-center justify-center text-xs text-gray-600',
		spacer: 'w-7 mr-2',
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
}

export const TreeItem: React.FC<TreeItemProps> = ({
	item,
	actualIndex,
	isSelected,
	onNodeClick,
	onToggleClick,
}) => {
	const top = actualIndex * 32;
	const itemCount = item.node.children.length;

	// Memoized class composition for better performance
	const dynamicClasses = useMemo(
		() => ({
			container: `${TreeItemClass.container.base} ${
				isSelected
					? TreeItemClass.container.selected
					: TreeItemClass.container.hover
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
		[isSelected, item.node.type]
	);

	return (
		<div
			key={item.node.id}
			className={dynamicClasses.container}
			style={{
				top,
				height: 32,
				paddingLeft: `${item.level * 20 + 8}px`,
			}}
			onClick={() => onNodeClick(item.node.id, item.node.type)}
		>
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
