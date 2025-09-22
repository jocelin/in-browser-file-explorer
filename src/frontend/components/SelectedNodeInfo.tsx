import React from 'react';

import { FileSystemNode } from '@file-explorer/types';

interface SelectedNodeInfoProps {
	selectedNode: FileSystemNode | null;
}

export const SelectedNodeInfo: React.FC<SelectedNodeInfoProps> = ({
	selectedNode,
}) => {
	if (!selectedNode) {
		return null;
	}

	return (
		<div className="mt-4 pt-4 border-t border-gray-100">
			<div className="flex items-center gap-2 text-sm text-gray-600">
				<span className="font-medium">Selected {selectedNode.type}:</span>
				<span className="px-2 py-1 bg-gray-100 rounded-md font-mono text-xs">
					{selectedNode.type === 'directory' ? '📁' : '📄'}{' '}
					{selectedNode.name || 'Root'}
				</span>
				{selectedNode.type === 'directory' && selectedNode.children && (
					<span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-md">
						{selectedNode.children.length.toLocaleString()} items
					</span>
				)}
			</div>
		</div>
	);
};
