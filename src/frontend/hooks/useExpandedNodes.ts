import { useState, useCallback } from 'react';
import { useFileSystemContext } from '../contexts';

export interface UseExpandedNodesReturn {
	expandedNodes: Set<string>;
	toggleNode: (nodeId: string) => void;
	expandAll: () => void;
	collapseAll: () => void;
	expandNode: (nodeId: string) => void;
}

/**
 * Hook for managing expanded nodes state with performance optimizations
 * Handles tree expansion/collapse state for the file system tree view
 */
export const useExpandedNodes = (): UseExpandedNodesReturn => {
	const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
	const { allNodes } = useFileSystemContext();

	const toggleNode = useCallback((nodeId: string) => {
		setExpandedNodes(prev => {
			const newSet = new Set(prev);
			if (newSet.has(nodeId)) {
				newSet.delete(nodeId);
			} else {
				newSet.add(nodeId);
			}
			return newSet;
		});
	}, []);

	const expandAll = useCallback(() => {
		const allDirectoryIds = allNodes
			.filter(node => node.type === 'directory')
			.map(node => node.id);
		setExpandedNodes(new Set(allDirectoryIds));
	}, [allNodes]);

	const collapseAll = useCallback(() => {
		setExpandedNodes(new Set());
	}, []);

	const expandNode = useCallback((nodeId: string) => {
		setExpandedNodes(prev => new Set(prev).add(nodeId));
	}, []);

	return {
		expandedNodes,
		toggleNode,
		expandAll,
		collapseAll,
		expandNode,
	};
};
