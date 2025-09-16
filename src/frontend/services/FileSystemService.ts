import {
	FileSystemNode,
	FileSystemState,
	CreateNodeRequest,
	FileSystemError,
} from '../types';

export class FileSystemService {
	private state: FileSystemState = {
		nodes: new Map(),
		rootId: null,
		selectedNodeId: null,
	};

	constructor() {
		this.initializeEmptyFileSystem();
	}

	private initializeEmptyFileSystem(): void {
		// Start with an empty file system
		this.state.nodes.clear();
		this.state.rootId = null;
		this.state.selectedNodeId = null;
	}

	public getState(): FileSystemState {
		return { ...this.state };
	}

	public getNode(id: string): FileSystemNode | null {
		return this.state.nodes.get(id) || null;
	}

	public getSelectedNode(): FileSystemNode | null {
		if (!this.state.selectedNodeId) return null;
		return this.getNode(this.state.selectedNodeId);
	}

	public selectNode(id: string): void {
		if (!this.state.nodes.has(id)) {
			throw this.createError('NODE_NOT_FOUND', `Node with id ${id} not found`);
		}
		this.state.selectedNodeId = id;
	}

	public createNode(request: CreateNodeRequest): FileSystemNode {
		this.validateCreateRequest(request);

		const id = this.generateId();
		const now = new Date();

		const newNode: FileSystemNode = {
			id,
			name: request.name,
			type: request.type,
			parentId: request.parentId,
			children: [],
			createdAt: now,
			modifiedAt: now,
		};

		this.state.nodes.set(id, newNode);

		// Add to parent's children if not root
		if (request.parentId) {
			const parent = this.state.nodes.get(request.parentId);
			if (parent) {
				parent.children.push(id);
				parent.modifiedAt = now;
			}
		} else {
			// This is the root node
			this.state.rootId = id;
		}

		return newNode;
	}

	public deleteNode(id: string): void {
		const node = this.state.nodes.get(id);
		if (!node) {
			throw this.createError('NODE_NOT_FOUND', `Node with id ${id} not found`);
		}

		if (id === this.state.rootId) {
			throw this.createError('ROOT_DELETE', 'Cannot delete root node');
		}

		// Recursively delete all children
		this.deleteNodeRecursive(id);

		// Remove from parent's children
		if (node.parentId) {
			const parent = this.state.nodes.get(node.parentId);
			if (parent) {
				parent.children = parent.children.filter(childId => childId !== id);
				parent.modifiedAt = new Date();
			}
		}

		// Clear selection if deleted node was selected
		if (this.state.selectedNodeId === id) {
			this.state.selectedNodeId = null;
		}
	}

	private deleteNodeRecursive(id: string): void {
		const node = this.state.nodes.get(id);
		if (!node) return;

		// Delete all children first
		for (const childId of node.children) {
			this.deleteNodeRecursive(childId);
		}

		// Delete the node itself
		this.state.nodes.delete(id);
	}

	public getAllNodes(): FileSystemNode[] {
		return Array.from(this.state.nodes.values());
	}

	public getChildren(parentId: string): FileSystemNode[] {
		const parent = this.state.nodes.get(parentId);
		if (!parent) return [];

		return parent.children
			.map(childId => this.state.nodes.get(childId))
			.filter((node): node is FileSystemNode => node !== undefined)
			.sort((a, b) => {
				// Directories first, then files, then alphabetically
				if (a.type !== b.type) {
					return a.type === 'directory' ? -1 : 1;
				}
				return a.name.localeCompare(b.name);
			});
	}

	public getRootNode(): FileSystemNode | null {
		if (!this.state.rootId) return null;
		return this.getNode(this.state.rootId);
	}

	public createRootDirectory(name: string = 'Root'): FileSystemNode {
		if (this.state.rootId) {
			throw this.createError('INVALID_PARENT', 'Root directory already exists');
		}

		return this.createNode({
			name,
			type: 'directory',
			parentId: '', // Empty string indicates root
		});
	}

	public generateExampleData(): void {
		// Clear existing data
		this.initializeEmptyFileSystem();

		// Create root directory
		const root = this.createRootDirectory('Root');
		this.selectNode(root.id);

		// Create some nested directories
		const docsDir = this.createNode({
			name: 'Documents',
			type: 'directory',
			parentId: root.id,
		});
		const picsDir = this.createNode({
			name: 'Pictures',
			type: 'directory',
			parentId: root.id,
		});
		const projectsDir = this.createNode({
			name: 'Projects',
			type: 'directory',
			parentId: root.id,
		});

		// Create subdirectories
		const workDir = this.createNode({
			name: 'Work',
			type: 'directory',
			parentId: docsDir.id,
		});
		const personalDir = this.createNode({
			name: 'Personal',
			type: 'directory',
			parentId: docsDir.id,
		});

		// Create some files
		this.createNode({ name: 'readme.txt', type: 'file', parentId: root.id });
		this.createNode({ name: 'config.json', type: 'file', parentId: root.id });
		this.createNode({ name: 'notes.md', type: 'file', parentId: docsDir.id });
		this.createNode({ name: 'report.pdf', type: 'file', parentId: workDir.id });
		this.createNode({
			name: 'my file.pdf',
			type: 'file',
			parentId: personalDir.id,
		});
		this.createNode({
			name: 'vacation.jpg',
			type: 'file',
			parentId: picsDir.id,
		});

		// Generate 10K files in nested structure for performance testing
		this.generateLargeDataset(projectsDir.id);
	}

	private generateLargeDataset(parentId: string): void {
		const totalFiles = 10000;

		// Create nested directory structure
		const subdirs: string[] = [];
		for (let i = 0; i < 10; i++) {
			const subdir = this.createNode({
				name: `Subdirectory_${i.toString().padStart(2, '0')}`,
				type: 'directory',
				parentId,
			});
			subdirs.push(subdir.id);
		}

		// Distribute files across subdirectories
		for (let i = 0; i < totalFiles; i++) {
			const subdirIndex = i % subdirs.length;
			const fileName = `file_${i.toString().padStart(5, '0')}.txt`;

			this.createNode({
				name: fileName,
				type: 'file',
				parentId: subdirs[subdirIndex],
			});

			// Create some nested subdirectories for complexity
			if (i % 100 === 0 && i > 0) {
				const nestedDir = this.createNode({
					name: `Nested_${i}`,
					type: 'directory',
					parentId: subdirs[subdirIndex],
				});

				// Add some files to nested directories
				for (let j = 0; j < 10; j++) {
					this.createNode({
						name: `nested_file_${j}.txt`,
						type: 'file',
						parentId: nestedDir.id,
					});
				}
			}
		}
	}

	private validateCreateRequest(request: CreateNodeRequest): void {
		if (!request.name || request.name.trim() === '') {
			throw this.createError('INVALID_NAME', 'Node name cannot be empty');
		}

		if (request.name.includes('/') || request.name.includes('\\')) {
			throw this.createError(
				'INVALID_NAME',
				'Node name cannot contain path separators'
			);
		}

		// Check for duplicate names in the same directory
		if (request.parentId) {
			const parent = this.state.nodes.get(request.parentId);
			if (!parent) {
				throw this.createError(
					'INVALID_PARENT',
					`Parent node with id ${request.parentId} not found`
				);
			}

			const existingChild = parent.children.find(childId => {
				const child = this.state.nodes.get(childId);
				return child && child.name === request.name;
			});

			if (existingChild) {
				throw this.createError(
					'DUPLICATE_NAME',
					`A node with name '${request.name}' already exists in this directory`
				);
			}
		}
	}

	private generateId(): string {
		return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	private createError(
		code: FileSystemError['code'],
		message: string
	): FileSystemError {
		const error = new Error(message) as FileSystemError;
		error.code = code;
		return error;
	}
}
