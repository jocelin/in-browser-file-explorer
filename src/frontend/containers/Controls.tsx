import React, { useState, useCallback } from 'react';
import {
	ControlButton,
	SelectedNodeInfo,
	ConfirmationDialog,
	CreateDialog,
	LoadingProgress,
} from '../components';
import { useFileSystemContext, useTreeContext } from '../contexts';
import { useSampleDataGenerator } from '../hooks';

interface ControlsProps {}

export const Controls: React.FC<ControlsProps> = () => {
	const {
		rootNode,
		selectedNode = null,
		createRoot,
		createNode,
		deleteNode,
		allNodes,
		resetFileSystem,
	} = useFileSystemContext();
	const { expandAll, collapseAll } = useTreeContext();
	const { isLoading, progress, generateExampleData } =
		useSampleDataGenerator(rootNode);

	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [showResetConfirmation, setShowResetConfirmation] = useState(false);

	const handleDeleteConfirm = useCallback(() => {
		if (selectedNode) {
			deleteNode(selectedNode.id);
		}
		setShowDeleteConfirmation(false);
	}, [selectedNode, deleteNode]);

	const handleConfirmReset = useCallback(() => {
		resetFileSystem();
		createRoot('Root');
		setShowResetConfirmation(false);
	}, [resetFileSystem, createRoot]);

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
			<div className="flex gap-3 flex-wrap items-center">
				<ControlButton
					disabled={!selectedNode || selectedNode.type !== 'directory'}
					onClick={() => setShowCreateDialog(true)}
					variant="primary"
				>
					➕ Create New Item
				</ControlButton>

				<ControlButton
					disabled={
						!selectedNode || !rootNode || selectedNode.id === rootNode.id
					}
					onClick={() => setShowDeleteConfirmation(true)}
					variant="danger"
				>
					🗑️ Delete Selected
				</ControlButton>

				<ControlButton onClick={expandAll} variant="secondary">
					📂 Expand All
				</ControlButton>

				<ControlButton onClick={collapseAll} variant="secondary">
					📁 Collapse All
				</ControlButton>

				<ControlButton onClick={generateExampleData} variant="ghost">
					⚡ Generate 10K Files
				</ControlButton>

				<ControlButton
					disabled={allNodes.length === 1}
					onClick={() => setShowResetConfirmation(true)}
					variant="danger"
				>
					🔄 Reset File System
				</ControlButton>
			</div>
			<SelectedNodeInfo selectedNode={selectedNode} />

			<LoadingProgress
				text="Generating Files..."
				isLoading={isLoading}
				progress={progress}
			/>

			<CreateDialog
				isOpen={showCreateDialog}
				onClose={() => setShowCreateDialog(false)}
				selectedNode={selectedNode}
				createNode={createNode}
			/>
			<ConfirmationDialog
				isOpen={showDeleteConfirmation}
				title="Delete Item"
				message={`Are you sure you want to delete "${selectedNode?.name || 'this item'}"? This action cannot be undone.`}
				confirmText="Delete"
				cancelText="Cancel"
				onConfirm={handleDeleteConfirm}
				onCancel={() => setShowDeleteConfirmation(false)}
			/>
			<ConfirmationDialog
				isOpen={showResetConfirmation}
				title="Reset File System"
				message="Are you sure you want to reset the file system? This will delete all files and directories and create a new root node."
				confirmText="Reset"
				cancelText="Cancel"
				onConfirm={handleConfirmReset}
				onCancel={() => setShowResetConfirmation(false)}
			/>
		</div>
	);
};
