import React, { useCallback } from 'react';

import { useFileSystemContext } from '../contexts';
import { useExpandedNodes } from '../hooks';
import {
	ErrorBoundary,
	ConfirmationDialog,
	EmptyState,
	ErrorDisplay,
} from '../components';

import { Controls, VirtualizedTree, Statistics } from './';

// Main FileExplorer Container Component
export const FileExplorer: React.FC = () => {
	const { rootNode, error, resetFileSystem, createRoot } =
		useFileSystemContext();
	const { expandedNodes, toggleNode, expandAll, collapseAll } =
		useExpandedNodes();

	// State for confirmation dialog
	const [showResetConfirmation, setShowResetConfirmation] =
		React.useState(false);

	const handleResetRequest = useCallback(() => {
		setShowResetConfirmation(true);
	}, []);

	const handleConfirmReset = useCallback(() => {
		resetFileSystem();
		createRoot('Root');
		setShowResetConfirmation(false);
	}, [resetFileSystem, createRoot]);

	const handleCancelReset = useCallback(() => {
		setShowResetConfirmation(false);
	}, []);

	return (
		<div className="file-explorer p-5 font-sans max-w-6xl mx-auto">
			<h1 className="text-3xl font-bold text-gray-800 mb-5">
				In-Browser File Explorer
			</h1>

			<ErrorDisplay error={error} />
			<ErrorBoundary>
				<Controls
					expandedNodes={expandedNodes}
					toggleNode={toggleNode}
					expandAll={expandAll}
					collapseAll={collapseAll}
					onResetRequest={handleResetRequest}
				/>
			</ErrorBoundary>

			<Statistics />

			<ErrorBoundary>
				{rootNode ? (
					<VirtualizedTree
						expandedNodes={expandedNodes}
						toggleNode={toggleNode}
					/>
				) : (
					<EmptyState />
				)}
			</ErrorBoundary>

			<ConfirmationDialog
				isOpen={showResetConfirmation}
				title="Reset File System"
				message="Are you sure you want to reset the file system? This will delete all files and directories and create a new root node."
				confirmText="Reset"
				cancelText="Cancel"
				onConfirm={handleConfirmReset}
				onCancel={handleCancelReset}
			/>
		</div>
	);
};
