import React from 'react';
import { ControlButton } from './ControlButton';
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

const SelectedNodeInfo: React.FC<{ selectedNode: FileSystemNode }> = ({
	selectedNode,
}) => (
	<div className="mt-4 pt-4 border-t border-gray-100">
		<div className="flex items-center gap-2 text-sm text-gray-600">
			<span className="font-medium">Selected:</span>
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
				<ControlButton onClick={onCreateRoot} variant="green" size="lg">
					🌱 Create Root Directory
				</ControlButton>
			)}

			{rootNode && (
				<>
					<ControlButton
						onClick={onShowCreateDialog}
						disabled={!selectedNode || selectedNode.type !== 'directory'}
						variant="blue"
					>
						➕ Create New Item
					</ControlButton>

					<ControlButton
						onClick={onDeleteNode}
						disabled={!selectedNode || selectedNode.id === rootNode.id}
						variant="red"
					>
						🗑️ Delete Selected
					</ControlButton>

					<ControlButton onClick={onExpandAll} variant="blue">
						📂 Expand All
					</ControlButton>

					<ControlButton onClick={onCollapseAll} variant="blue">
						📁 Collapse All
					</ControlButton>

					<ControlButton onClick={onGenerateExampleData} variant="purple">
						⚡ Generate 10K Files
					</ControlButton>
				</>
			)}
		</div>
		{selectedNode && <SelectedNodeInfo selectedNode={selectedNode} />}
	</div>
);
