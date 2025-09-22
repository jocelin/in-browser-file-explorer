import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useFileSystemContext } from './FileSystemContext';

interface TreeContextValue {
	expandedNodes: Set<string>;
	toggleNode: (nodeId: string) => void;
	expandNode: (nodeId: string) => void;
	expandAll: () => void;
	collapseAll: () => void;
}

const TreeContext = createContext<TreeContextValue | null>(null);

interface TreeProviderProps {
	children: ReactNode;
}

export const TreeProvider: React.FC<TreeProviderProps> = ({ children }) => {
	const { allNodes } = useFileSystemContext();
	const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

	const expandAll = () => {
		const nodesToExpand = allNodes
			.filter(node => node.type === 'directory')
			.map(node => node.id);
		setExpandedNodes(new Set(nodesToExpand));
	};

	const collapseAll = () => setExpandedNodes(new Set());

	const toggleNode = (nodeId: string) => {
		setExpandedNodes(prev => {
			const newSet = new Set(prev);
			if (newSet.has(nodeId)) {
				newSet.delete(nodeId);
			} else {
				newSet.add(nodeId);
			}
			return newSet;
		});
	};

	const expandNode = (nodeId: string) => {
		setExpandedNodes(prev => new Set(prev).add(nodeId));
	};

	const value: TreeContextValue = {
		expandedNodes,
		toggleNode,
		expandNode,
		expandAll,
		collapseAll,
	};

	return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>;
};

export const useTreeContext = (): TreeContextValue => {
	const context = useContext(TreeContext);
	if (!context) {
		throw new Error('useTreeContext must be used within a TreeProvider');
	}
	return context;
};
