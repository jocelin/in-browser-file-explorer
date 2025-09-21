import React from 'react';
import { ControlButton } from './ControlButton';
import { SelectedNodeInfo } from './SelectedNodeInfo';
import { FileSystemNode } from '../types';

interface ControlsProps {
	rootNode: FileSystemNode | null;
	selectedNode: FileSystemNode | null;
	onCreateRoot: () => void;
	onShowCreateDialog: () => void;
	onDeleteNode: () => void;
	onExpandAll: () => void;
	onCollapseAll: () => void;
	onGenerateExampleData: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
	rootNode,
	selectedNode,
	onCreateRoot,
	onShowCreateDialog,
	onDeleteNode,
	onExpandAll,
	onCollapseAll,
	onGenerateExampleData,
}) => (
	<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
		{rootNode && !selectedNode && (
			<h3 className="p-2 text-gray-600 ">
				Select Root to create new item, or generate 10K files to get started.
			</h3>
		)}

		<div className="flex gap-3 flex-wrap items-center">
			{!rootNode && (
				<ControlButton onClick={onCreateRoot} variant="primary" size="lg">
					🌱 Create Root Directory
				</ControlButton>
			)}

			{rootNode && (
				<>
					<ControlButton
						onClick={onShowCreateDialog}
						disabled={!selectedNode || selectedNode.type !== 'directory'}
						variant="primary"
					>
						✨ Create New Item
					</ControlButton>

					<ControlButton
						onClick={onDeleteNode}
						disabled={!selectedNode || selectedNode.id === rootNode.id}
						variant="danger"
					>
						🗑️ Delete Selected
					</ControlButton>

					<ControlButton onClick={onExpandAll} variant="secondary">
						📂 Expand All
					</ControlButton>

					<ControlButton onClick={onCollapseAll} variant="secondary">
						📁 Collapse All
					</ControlButton>

					<ControlButton onClick={onGenerateExampleData} variant="ghost">
						⚡ Generate 10K Files
					</ControlButton>
				</>
			)}
		</div>
		{selectedNode && <SelectedNodeInfo selectedNode={selectedNode} />}
	</div>
);
