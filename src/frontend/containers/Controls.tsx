import React, { useState, useCallback } from 'react';
import { ControlButton } from '../components/ControlButton';
import { SelectedNodeInfo } from '../components/SelectedNodeInfo';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { CreateDialog } from '../components/CreateDialog';
import { LoadingProgress } from '../components/LoadingProgress';
import { useFileSystemContext } from '../contexts';
import { useSampleDataGenerator } from '../hooks';

interface ControlsProps {
	expandedNodes: Set<string>;
	toggleNode: (nodeId: string) => void;
	expandAll: () => void;
	collapseAll: () => void;
	onResetRequest: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
	expandedNodes: _expandedNodes,
	toggleNode: _toggleNode,
	expandAll,
	collapseAll,
	onResetRequest,
}) => {
	const {
		rootNode,
		selectedNode = null,
		createRoot,
		createNode,
		deleteNode,
	} = useFileSystemContext();

	const { isLoading, progress, generateExampleData } =
		useSampleDataGenerator(rootNode);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	const handleDeleteClick = useCallback(() => {
		setShowDeleteConfirmation(true);
	}, []);

	const handleDeleteConfirm = useCallback(() => {
		if (selectedNode) {
			deleteNode(selectedNode.id);
		}
		setShowDeleteConfirmation(false);
	}, [selectedNode, deleteNode]);

	const handleDeleteCancel = useCallback(() => {
		setShowDeleteConfirmation(false);
	}, []);

	const handleCreateRoot = useCallback(() => {
		createRoot('Root');
	}, [createRoot]);

	const handleExpandAll = useCallback(() => {
		expandAll();
	}, [expandAll]);

	const handleCollapseAll = useCallback(() => {
		collapseAll();
	}, [collapseAll]);

	const handleResetFileSystem = useCallback(() => {
		onResetRequest();
	}, [onResetRequest]);

	const handleCreateNewItem = useCallback(() => {
		setShowCreateDialog(true);
	}, []);

	const handleCloseCreateDialog = useCallback(() => {
		setShowCreateDialog(false);
	}, []);

	const handleGenerateExampleData = useCallback(async () => {
		generateExampleData();
	}, [generateExampleData]);

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
			{rootNode && !selectedNode && (
				<h3 className="p-2 text-gray-600 ">
					Select Root to create new item, or generate 10K files to get started.
				</h3>
			)}

			<div className="flex gap-3 flex-wrap items-center">
				{!rootNode && (
					<ControlButton onClick={handleCreateRoot} variant="primary" size="lg">
						📁 Create Root Directory
					</ControlButton>
				)}

				{rootNode && (
					<>
						<ControlButton
							onClick={handleCreateNewItem}
							disabled={!selectedNode || selectedNode.type !== 'directory'}
							variant="primary"
						>
							➕ Create New Item
						</ControlButton>

						<ControlButton
							onClick={handleDeleteClick}
							disabled={!selectedNode || selectedNode.id === rootNode.id}
							variant="danger"
						>
							🗑️ Delete Selected
						</ControlButton>

						<ControlButton onClick={handleExpandAll} variant="secondary">
							📂 Expand All
						</ControlButton>

						<ControlButton onClick={handleCollapseAll} variant="secondary">
							📁 Collapse All
						</ControlButton>

						<ControlButton onClick={handleGenerateExampleData} variant="ghost">
							⚡ Generate 10K Files
						</ControlButton>

						<ControlButton onClick={handleResetFileSystem} variant="danger">
							🔄 Reset File System
						</ControlButton>
					</>
				)}
			</div>
			<SelectedNodeInfo selectedNode={selectedNode} />

			<LoadingProgress isLoading={isLoading} progress={progress} />

			<ConfirmationDialog
				isOpen={showDeleteConfirmation}
				title="Delete Item"
				message={`Are you sure you want to delete "${selectedNode?.name || 'this item'}"? This action cannot be undone.`}
				confirmText="Delete"
				cancelText="Cancel"
				onConfirm={handleDeleteConfirm}
				onCancel={handleDeleteCancel}
			/>

			<CreateDialog
				isOpen={showCreateDialog}
				onClose={handleCloseCreateDialog}
				selectedNode={selectedNode}
				createNode={createNode}
			/>
		</div>
	);
};
