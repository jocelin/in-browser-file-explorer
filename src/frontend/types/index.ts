export interface FileSystemNode {
	id: string;
	name: string;
	type: 'file' | 'directory';
	parentId: string | null;
	children: string[]; // IDs of child nodes
	createdAt: Date;
	modifiedAt: Date;
}

export interface FileSystemState {
	nodes: Map<string, FileSystemNode>;
	rootId: string | null;
	selectedNodeId: string | null;
}

export interface TreeNode {
	node: FileSystemNode;
	level: number;
	isExpanded: boolean;
	isVisible: boolean;
	parentPath: string[];
}

export interface CreateNodeRequest {
	name: string;
	type: 'file' | 'directory';
	parentId: string;
}

export interface FileSystemError extends Error {
	code:
		| 'NODE_NOT_FOUND'
		| 'INVALID_NAME'
		| 'DUPLICATE_NAME'
		| 'INVALID_PARENT'
		| 'ROOT_DELETE';
}
