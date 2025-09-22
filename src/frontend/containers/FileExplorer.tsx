import React from 'react';

import { useFileSystemContext, TreeProvider } from '../contexts';
import {
	ErrorBoundary,
	EmptyState,
	ErrorDisplay,
	ControlButton,
} from '../components';

import { Controls, VirtualizedTree, Statistics } from './';

// Main FileExplorer Container Component
export const FileExplorer: React.FC = () => {
	const { rootNode, error, createRoot } = useFileSystemContext();

	return (
		<div className="file-explorer p-5 font-sans max-w-6xl mx-auto">
			<h1 className="text-3xl font-bold text-gray-800 mb-5">
				In-Browser File Explorer
			</h1>

			<ErrorDisplay error={error} />

			<ErrorBoundary>
				{!rootNode ? (
					<>
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
							<ControlButton
								onClick={() => createRoot('Root')}
								variant="primary"
								size="lg"
							>
								📁 Create Root Directory
							</ControlButton>
						</div>
						<EmptyState />
					</>
				) : (
					<TreeProvider>
						<Controls />
						<Statistics />
						<VirtualizedTree />
					</TreeProvider>
				)}
			</ErrorBoundary>
		</div>
	);
};
