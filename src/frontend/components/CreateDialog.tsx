import React, { useCallback, useState, useEffect } from 'react';

import { SelectedNodeInfo } from '@file-explorer/components';
import {
	ButtonClass,
	CreateNodeRequest,
	FileSystemNode,
	NodeType,
} from '@file-explorer/types';

interface CreateDialogProps {
	isOpen: boolean;
	onClose: () => void;
	selectedNode: FileSystemNode | null;
	createNode: (request: CreateNodeRequest) => FileSystemNode | null;
}

export const CreateDialog: React.FC<CreateDialogProps> = ({
	isOpen,
	onClose,
	selectedNode,
	createNode,
}) => {
	const [nodeType, setNodeType] = useState<NodeType>('file');
	const [nodeName, setNodeName] = useState('');

	// Reset form when dialog opens
	useEffect(() => {
		if (isOpen) {
			setNodeName('');
			setNodeType('file');
		}
	}, [isOpen]);

	const handleCreateNode = useCallback(() => {
		if (
			!nodeName?.trim() ||
			!selectedNode ||
			selectedNode.type !== 'directory'
		) {
			return;
		}

		const result = createNode?.({
			name: nodeName.trim(),
			type: nodeType,
			parentId: selectedNode.id,
		});

		if (result) {
			setNodeName('');
			setNodeType('file');
			onClose();
		}
	}, [selectedNode, nodeName, nodeType, createNode, onClose]);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				handleCreateNode();
			}
		},
		[handleCreateNode]
	);

	const handleClose = useCallback(() => {
		setNodeName('');
		setNodeType('file');
		onClose();
	}, [onClose]);

	if (!isOpen || !selectedNode) {
		return null;
	}

	return (
		<div className="fixed inset-0 backdrop-invert backdrop-opacity-20 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg min-w-96 shadow-xl border border-gray-200">
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
								checked={nodeType === 'file'}
								onChange={e =>
									setNodeType(e.target.value as 'file' | 'directory')
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
								checked={nodeType === 'directory'}
								onChange={e =>
									setNodeType(e.target.value as 'file' | 'directory')
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
						value={nodeName}
						onChange={e => setNodeName(e.target.value)}
						placeholder={`Enter ${nodeType} name...`}
						className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
						onKeyDown={handleKeyPress}
						autoFocus
					/>
				</div>

				<div className="flex justify-end space-x-3">
					<button
						onClick={handleClose}
						className={`${ButtonClass.size.md} ${ButtonClass.variants.secondary}`}
					>
						Cancel
					</button>
					<button
						onClick={handleCreateNode}
						className={`${ButtonClass.size.md} ${ButtonClass.variants.primary}`}
					>
						Create
					</button>
				</div>
			</div>
		</div>
	);
};
