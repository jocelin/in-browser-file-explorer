import React from 'react';

import { FileSystemNode } from '../types';
import { SelectedNodeInfo } from './SelectedNodeInfo';

interface CreateDialogProps {
	isOpen: boolean;
	createNodeType: 'file' | 'directory';
	newNodeName: string;
	selectedNode: FileSystemNode;
	onClose: () => void;
	onCreateNodeTypeChange: (type: 'file' | 'directory') => void;
	onNewNodeNameChange: (name: string) => void;
	onCreateNode: () => void;
}

export const CreateDialog: React.FC<CreateDialogProps> = ({
	isOpen,
	createNodeType,
	newNodeName,
	selectedNode,
	onClose,
	onCreateNodeTypeChange,
	onNewNodeNameChange,
	onCreateNode,
}) => {
	if (!isOpen) {
		return null;
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onCreateNode();
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg min-w-96 shadow-xl">
				<div className="text-xl font-semibold mb-5">
					<h3>Create New Item</h3>
					<h4>
						<SelectedNodeInfo selectedNode={selectedNode} />
					</h4>
				</div>

				<div className="mb-4">
					<label className="block mb-2 font-semibold">Type:</label>
					<div className="flex gap-4">
						<label className="flex items-center cursor-pointer">
							<input
								type="radio"
								name="nodeType"
								value="file"
								checked={createNodeType === 'file'}
								onChange={e =>
									onCreateNodeTypeChange(e.target.value as 'file' | 'directory')
								}
								className="mr-2"
							/>
							File
						</label>
						<label className="flex items-center cursor-pointer">
							<input
								type="radio"
								name="nodeType"
								value="directory"
								checked={createNodeType === 'directory'}
								onChange={e =>
									onCreateNodeTypeChange(e.target.value as 'file' | 'directory')
								}
								className="mr-2"
							/>
							Directory
						</label>
					</div>
				</div>

				<div className="mb-5">
					<label className="block mb-2 font-semibold">Name:</label>
					<input
						type="text"
						value={newNodeName}
						onChange={e => onNewNodeNameChange(e.target.value)}
						placeholder={`Enter ${createNodeType} name...`}
						className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
						onKeyPress={handleKeyPress}
						autoFocus
					/>
				</div>

				<div className="flex gap-3 justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
					>
						Cancel
					</button>
					<button
						onClick={onCreateNode}
						className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer"
					>
						Create
					</button>
				</div>
			</div>
		</div>
	);
};
