import React, { useState, useCallback, useMemo } from 'react';

import { FileSystemService } from '../services';
import { CreateNodeRequest } from '../types';

import {
	Controls,
	CreateDialog,
	EmptyState,
	ErrorDisplay,
	Statistics,
	VirtualizedTree,
} from '../components';

// Main FileExplorer Component
export const FileExplorer: React.FC = () => {
	const [fileSystem] = useState(() => new FileSystemService());
	const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [createNodeType, setCreateNodeType] = useState<'file' | 'directory'>(
		'file'
	);
	const [newNodeName, setNewNodeName] = useState('');
	const [error, setError] = useState<string | null>(null);
	// Add a refresh counter to force re-renders when file system changes
	const [refreshKey, setRefreshKey] = useState(0);

	const forceRefresh = useCallback(() => {
		setRefreshKey(prev => prev + 1);
	}, []);

	const state = fileSystem.getState();
	const selectedNode = fileSystem.getSelectedNode();
	const rootNode = fileSystem.getRootNode();

	const handleNodeSelect = useCallback(
		(nodeId: string) => {
			try {
				fileSystem.selectNode(nodeId);
				setError(null);
				forceRefresh(); // Force re-render after state change
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to select node');
			}
		},
		[fileSystem, forceRefresh]
	);

	const handleNodeToggle = useCallback((nodeId: string) => {
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

	const handleCreateNode = useCallback(() => {
		if (!selectedNode || selectedNode.type !== 'directory') {
			setError('Please select a directory to create a new item');
			return;
		}

		if (!newNodeName.trim()) {
			setError('Please enter a name for the new item');
			return;
		}

		try {
			const request: CreateNodeRequest = {
				name: newNodeName.trim(),
				type: createNodeType,
				parentId: selectedNode.id,
			};

			fileSystem.createNode(request);
			setNewNodeName('');
			setShowCreateDialog(false);
			setError(null);

			// Auto-expand parent directory to show new item
			setExpandedNodes(prev => new Set(prev).add(selectedNode.id));
			forceRefresh(); // Force re-render after creating node
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create node');
		}
	}, [selectedNode, newNodeName, createNodeType, fileSystem, forceRefresh]);

	const handleDeleteNode = useCallback(() => {
		if (!selectedNode) {
			setError('Please select a node to delete');
			return;
		}

		if (selectedNode.id === rootNode?.id) {
			setError('Cannot delete the root directory');
			return;
		}

		try {
			fileSystem.deleteNode(selectedNode.id);
			setError(null);
			forceRefresh(); // Force re-render after deleting node
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete node');
		}
	}, [selectedNode, rootNode, fileSystem, forceRefresh]);

	const handleGenerateExampleData = useCallback(() => {
		try {
			fileSystem.generateExampleData();
			setExpandedNodes(new Set());
			setError(null);
			forceRefresh(); // Force re-render after generating data
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to generate example data'
			);
		}
	}, [fileSystem, forceRefresh]);

	const handleCreateRoot = useCallback(() => {
		try {
			fileSystem.createRootDirectory('Root');
			setError(null);
			forceRefresh(); // Force re-render after creating root
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to create root directory'
			);
		}
	}, [fileSystem, forceRefresh]);

	const handleExpandAll = useCallback(() => {
		const allDirectoryIds = fileSystem
			.getAllNodes()
			.filter(node => node.type === 'directory')
			.map(node => node.id);

		setExpandedNodes(new Set(allDirectoryIds));
	}, [fileSystem, refreshKey]); // Add refreshKey as dependency

	const handleCollapseAll = useCallback(() => {
		setExpandedNodes(new Set());
	}, []);

	const handleCloseCreateDialog = useCallback(() => {
		setShowCreateDialog(false);
		setNewNodeName('');
	}, []);

	const nodeCount = useMemo(() => {
		return fileSystem.getAllNodes().length;
	}, [fileSystem, refreshKey]); // Add refreshKey as dependency

	const directoryCount = useMemo(() => {
		return fileSystem.getAllNodes().filter(node => node.type === 'directory')
			.length;
	}, [fileSystem, refreshKey]); // Add refreshKey as dependency

	const fileCount = useMemo(() => {
		return fileSystem.getAllNodes().filter(node => node.type === 'file').length;
	}, [fileSystem, refreshKey]); // Add refreshKey as dependency

	return (
		<div className="file-explorer p-5 font-sans max-w-6xl mx-auto">
			<h1 className="text-3xl font-bold text-gray-800 mb-5">
				In-Browser File Explorer
			</h1>

			<ErrorDisplay error={error} />

			<Controls
				rootNode={rootNode}
				selectedNode={selectedNode}
				onCreateRoot={handleCreateRoot}
				onShowCreateDialog={() => setShowCreateDialog(true)}
				onDeleteNode={handleDeleteNode}
				onExpandAll={handleExpandAll}
				onCollapseAll={handleCollapseAll}
				onGenerateExampleData={handleGenerateExampleData}
			/>

			{rootNode && (
				<Statistics
					nodeCount={nodeCount}
					directoryCount={directoryCount}
					fileCount={fileCount}
				/>
			)}

			{rootNode ? (
				<VirtualizedTree
					nodes={fileSystem.getAllNodes()}
					rootId={rootNode.id}
					selectedNodeId={state.selectedNodeId}
					expandedNodes={expandedNodes}
					onNodeSelect={handleNodeSelect}
					onNodeToggle={handleNodeToggle}
					containerHeight={500}
				/>
			) : (
				<EmptyState />
			)}

			<CreateDialog
				isOpen={showCreateDialog}
				createNodeType={createNodeType}
				newNodeName={newNodeName}
				onClose={handleCloseCreateDialog}
				onCreateNodeTypeChange={setCreateNodeType}
				onNewNodeNameChange={setNewNodeName}
				onCreateNode={handleCreateNode}
			/>
		</div>
	);
};
