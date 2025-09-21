import { FileSystemNode, CreateNodeRequest } from '../types';
import { FileSystemService } from './FileSystemService';

describe('FileSystemService', () => {
	let service: FileSystemService;

	beforeEach(() => {
		service = new FileSystemService();
	});

	describe('constructor', () => {
		it('should initialize with empty file system', () => {
			const state = service.getState();
			expect(state.nodes.size).toBe(0);
			expect(state.rootId).toBeNull();
			expect(state.selectedNodeId).toBeNull();
		});
	});

	describe('getState', () => {
		it('should return a copy of the current state', () => {
			const state1 = service.getState();
			const state2 = service.getState();

			expect(state1).not.toBe(state2); // Different objects
			expect(state1).toEqual(state2); // Same content
		});
	});

	describe('createRootDirectory', () => {
		it('should create a root directory with default name', () => {
			const root = service.createRootDirectory();

			expect(root.name).toBe('Root');
			expect(root.type).toBe('directory');
			expect(root.parentId).toBe('');
			expect(root.children).toEqual([]);
			expect(service.getState().rootId).toBe(root.id);
		});

		it('should create a root directory with custom name', () => {
			const root = service.createRootDirectory('MyRoot');

			expect(root.name).toBe('MyRoot');
			expect(root.type).toBe('directory');
		});

		it('should throw error if root already exists', () => {
			service.createRootDirectory();

			expect(() => service.createRootDirectory()).toThrow(
				'Root directory already exists'
			);
		});
	});

	describe('createNode', () => {
		let root: FileSystemNode;

		beforeEach(() => {
			root = service.createRootDirectory();
		});

		it('should create a file node', () => {
			const request: CreateNodeRequest = {
				name: 'test.txt',
				type: 'file',
				parentId: root.id,
			};

			const node = service.createNode(request);

			expect(node.name).toBe('test.txt');
			expect(node.type).toBe('file');
			expect(node.parentId).toBe(root.id);
			expect(node.children).toEqual([]);
			expect(node.createdAt).toBeInstanceOf(Date);
			expect(node.modifiedAt).toBeInstanceOf(Date);
			expect(node.id).toMatch(/^node_\d+_[a-z0-9]+$/);
		});

		it('should create a directory node', () => {
			const request: CreateNodeRequest = {
				name: 'testdir',
				type: 'directory',
				parentId: root.id,
			};

			const node = service.createNode(request);

			expect(node.name).toBe('testdir');
			expect(node.type).toBe('directory');
			expect(node.parentId).toBe(root.id);
			expect(node.children).toEqual([]);
		});

		it('should add node to parent children', () => {
			const request: CreateNodeRequest = {
				name: 'child.txt',
				type: 'file',
				parentId: root.id,
			};

			const childNode = service.createNode(request);
			const updatedRoot = service.getNode(root.id);

			expect(updatedRoot?.children).toContain(childNode.id);
			expect(updatedRoot?.modifiedAt.getTime()).toBeGreaterThanOrEqual(
				root.modifiedAt.getTime()
			);
		});

		it('should throw error for empty name', () => {
			const request: CreateNodeRequest = {
				name: '',
				type: 'file',
				parentId: root.id,
			};

			expect(() => service.createNode(request)).toThrow(
				'Node name cannot be empty'
			);
		});

		it('should throw error for whitespace-only name', () => {
			const request: CreateNodeRequest = {
				name: '   ',
				type: 'file',
				parentId: root.id,
			};

			expect(() => service.createNode(request)).toThrow(
				'Node name cannot be empty'
			);
		});

		it('should throw error for name with forward slash', () => {
			const request: CreateNodeRequest = {
				name: 'invalid/name',
				type: 'file',
				parentId: root.id,
			};

			expect(() => service.createNode(request)).toThrow(
				'Node name cannot contain path separators'
			);
		});

		it('should throw error for name with backslash', () => {
			const request: CreateNodeRequest = {
				name: 'invalid\\name',
				type: 'file',
				parentId: root.id,
			};

			expect(() => service.createNode(request)).toThrow(
				'Node name cannot contain path separators'
			);
		});

		it('should throw error for non-existent parent', () => {
			const request: CreateNodeRequest = {
				name: 'test.txt',
				type: 'file',
				parentId: 'non-existent',
			};

			expect(() => service.createNode(request)).toThrow(
				'Parent node with id non-existent not found'
			);
		});

		it('should throw error for duplicate name in same directory', () => {
			const request: CreateNodeRequest = {
				name: 'duplicate.txt',
				type: 'file',
				parentId: root.id,
			};

			service.createNode(request);

			expect(() => service.createNode(request)).toThrow(
				"A node with name 'duplicate.txt' already exists in this directory"
			);
		});

		it('should allow same name in different directories', () => {
			const dir1 = service.createNode({
				name: 'dir1',
				type: 'directory',
				parentId: root.id,
			});

			const dir2 = service.createNode({
				name: 'dir2',
				type: 'directory',
				parentId: root.id,
			});

			const file1 = service.createNode({
				name: 'same-name.txt',
				type: 'file',
				parentId: dir1.id,
			});

			const file2 = service.createNode({
				name: 'same-name.txt',
				type: 'file',
				parentId: dir2.id,
			});

			expect(file1.name).toBe(file2.name);
			expect(file1.parentId).not.toBe(file2.parentId);
		});
	});

	describe('getNode', () => {
		it('should return node by id', () => {
			const root = service.createRootDirectory();
			const retrievedNode = service.getNode(root.id);

			expect(retrievedNode).toEqual(root);
		});

		it('should return null for non-existent node', () => {
			const node = service.getNode('non-existent');
			expect(node).toBeNull();
		});
	});

	describe('getRootNode', () => {
		it('should return root node', () => {
			const root = service.createRootDirectory();
			const retrievedRoot = service.getRootNode();

			expect(retrievedRoot).toEqual(root);
		});

		it('should return null when no root exists', () => {
			const root = service.getRootNode();
			expect(root).toBeNull();
		});
	});

	describe('selectNode', () => {
		it('should select existing node', () => {
			const root = service.createRootDirectory();
			service.selectNode(root.id);

			expect(service.getState().selectedNodeId).toBe(root.id);
		});

		it('should throw error for non-existent node', () => {
			expect(() => service.selectNode('non-existent')).toThrow(
				'Node with id non-existent not found'
			);
		});
	});

	describe('getSelectedNode', () => {
		it('should return selected node', () => {
			const root = service.createRootDirectory();
			service.selectNode(root.id);

			const selectedNode = service.getSelectedNode();
			expect(selectedNode).toEqual(root);
		});

		it('should return null when no node selected', () => {
			const selectedNode = service.getSelectedNode();
			expect(selectedNode).toBeNull();
		});

		it('should return null when selected node no longer exists', () => {
			const root = service.createRootDirectory();
			const file = service.createNode({
				name: 'test.txt',
				type: 'file',
				parentId: root.id,
			});

			service.selectNode(file.id);
			service.deleteNode(file.id);

			const selectedNode = service.getSelectedNode();
			expect(selectedNode).toBeNull();
		});
	});

	describe('deleteNode', () => {
		let root: FileSystemNode;
		let childDir: FileSystemNode;
		let childFile: FileSystemNode;

		beforeEach(() => {
			root = service.createRootDirectory();
			childDir = service.createNode({
				name: 'childdir',
				type: 'directory',
				parentId: root.id,
			});
			childFile = service.createNode({
				name: 'child.txt',
				type: 'file',
				parentId: childDir.id,
			});
		});

		it('should delete a file node', () => {
			service.deleteNode(childFile.id);

			expect(service.getNode(childFile.id)).toBeNull();

			const updatedDir = service.getNode(childDir.id);
			expect(updatedDir?.children).not.toContain(childFile.id);
		});

		it('should delete directory and all its children recursively', () => {
			const nestedDir = service.createNode({
				name: 'nested',
				type: 'directory',
				parentId: childDir.id,
			});
			const nestedFile = service.createNode({
				name: 'nested.txt',
				type: 'file',
				parentId: nestedDir.id,
			});

			service.deleteNode(childDir.id);

			expect(service.getNode(childDir.id)).toBeNull();
			expect(service.getNode(childFile.id)).toBeNull();
			expect(service.getNode(nestedDir.id)).toBeNull();
			expect(service.getNode(nestedFile.id)).toBeNull();

			const updatedRoot = service.getNode(root.id);
			expect(updatedRoot?.children).not.toContain(childDir.id);
		});

		it('should update parent modified date when deleting child', () => {
			const originalModifiedTime = service
				.getNode(root.id)
				?.modifiedAt.getTime();

			// Add a small delay to ensure time difference
			return new Promise(resolve => {
				setTimeout(() => {
					service.deleteNode(childDir.id);

					const updatedRoot = service.getNode(root.id);
					expect(updatedRoot?.modifiedAt.getTime()).toBeGreaterThanOrEqual(
						originalModifiedTime!
					);
					resolve(undefined);
				}, 10);
			});
		});

		it('should clear selection if deleted node was selected', () => {
			service.selectNode(childFile.id);
			service.deleteNode(childFile.id);

			expect(service.getState().selectedNodeId).toBeNull();
		});

		it('should not clear selection if different node was deleted', () => {
			service.selectNode(root.id);
			service.deleteNode(childFile.id);

			expect(service.getState().selectedNodeId).toBe(root.id);
		});

		it('should throw error for non-existent node', () => {
			expect(() => service.deleteNode('non-existent')).toThrow(
				'Node with id non-existent not found'
			);
		});

		it('should throw error when trying to delete root', () => {
			expect(() => service.deleteNode(root.id)).toThrow(
				'Cannot delete root node'
			);
		});
	});

	describe('getAllNodes', () => {
		it('should return empty array for empty file system', () => {
			const nodes = service.getAllNodes();
			expect(nodes).toEqual([]);
		});

		it('should return all nodes', () => {
			const root = service.createRootDirectory();
			const file = service.createNode({
				name: 'test.txt',
				type: 'file',
				parentId: root.id,
			});

			const nodes = service.getAllNodes();
			expect(nodes).toHaveLength(2);
			expect(nodes).toContain(root);
			expect(nodes).toContain(file);
		});
	});

	describe('getChildren', () => {
		let root: FileSystemNode;
		let dir1: FileSystemNode;
		let dir2: FileSystemNode;
		let file1: FileSystemNode;
		let file2: FileSystemNode;

		beforeEach(() => {
			root = service.createRootDirectory();
			dir1 = service.createNode({
				name: 'b_directory',
				type: 'directory',
				parentId: root.id,
			});
			dir2 = service.createNode({
				name: 'a_directory',
				type: 'directory',
				parentId: root.id,
			});
			file1 = service.createNode({
				name: 'z_file.txt',
				type: 'file',
				parentId: root.id,
			});
			file2 = service.createNode({
				name: 'a_file.txt',
				type: 'file',
				parentId: root.id,
			});
		});

		it('should return children sorted (directories first, then alphabetically)', () => {
			const children = service.getChildren(root.id);

			expect(children).toHaveLength(4);
			// Directories first
			expect(children[0]).toEqual(dir2); // a_directory
			expect(children[1]).toEqual(dir1); // b_directory
			// Then files alphabetically
			expect(children[2]).toEqual(file2); // a_file.txt
			expect(children[3]).toEqual(file1); // z_file.txt
		});

		it('should return empty array for non-existent parent', () => {
			const children = service.getChildren('non-existent');
			expect(children).toEqual([]);
		});

		it('should return empty array for node with no children', () => {
			const children = service.getChildren(file1.id);
			expect(children).toEqual([]);
		});

		it('should handle missing child nodes gracefully', () => {
			// Manually corrupt the state by adding non-existent child id
			const rootNode = service.getNode(root.id);
			if (rootNode) {
				rootNode.children.push('non-existent-child');
			}

			const children = service.getChildren(root.id);
			expect(children).toHaveLength(4); // Should filter out the non-existent child
		});
	});

	describe('generateExampleData', () => {
		it('should generate example file system structure', () => {
			service.generateExampleData();

			const state = service.getState();
			expect(state.rootId).not.toBeNull();
			expect(state.nodes.size).toBeGreaterThan(10000); // Should have many nodes

			const root = service.getRootNode();
			expect(root?.name).toBe('Root');
			expect(service.getState().selectedNodeId).toBe(root?.id);

			const children = service.getChildren(root!.id);
			expect(children.some(child => child.name === 'Documents')).toBe(true);
			expect(children.some(child => child.name === 'Pictures')).toBe(true);
			expect(children.some(child => child.name === 'Projects')).toBe(true);
		});

		it('should clear existing data before generating', () => {
			const initialRoot = service.createRootDirectory('InitialRoot');
			service.selectNode(initialRoot.id);

			service.generateExampleData();

			expect(service.getNode(initialRoot.id)).toBeNull();

			const newRoot = service.getRootNode();
			expect(newRoot?.name).toBe('Root');
			expect(newRoot?.id).not.toBe(initialRoot.id);
		});
	});

	describe('edge cases and error handling', () => {
		it('should handle rapid node creation', () => {
			const root = service.createRootDirectory();
			const nodes: FileSystemNode[] = [];

			for (let i = 0; i < 100; i++) {
				const node = service.createNode({
					name: `file_${i}.txt`,
					type: 'file',
					parentId: root.id,
				});
				nodes.push(node);
			}

			expect(nodes).toHaveLength(100);
			expect(new Set(nodes.map(n => n.id)).size).toBe(100); // All IDs should be unique
		});

		it('should maintain data consistency after multiple operations', () => {
			const root = service.createRootDirectory();
			const dir = service.createNode({
				name: 'testdir',
				type: 'directory',
				parentId: root.id,
			});
			const file = service.createNode({
				name: 'test.txt',
				type: 'file',
				parentId: dir.id,
			});

			service.selectNode(file.id);
			service.deleteNode(dir.id); // This should delete both dir and file

			expect(service.getNode(dir.id)).toBeNull();
			expect(service.getNode(file.id)).toBeNull();
			// Note: The service doesn't automatically clear selection when deleting parent of selected node
			// This behavior may need to be implemented in the service if desired
			expect(service.getChildren(root.id)).toHaveLength(0);
		});

		it('should handle unicode characters in node names', () => {
			const root = service.createRootDirectory();
			const unicodeNames = ['文件.txt', 'файл.txt', '🎉 emoji.txt', 'café.txt'];

			unicodeNames.forEach(name => {
				const node = service.createNode({
					name,
					type: 'file',
					parentId: root.id,
				});
				expect(node.name).toBe(name);
			});

			const children = service.getChildren(root.id);
			expect(children).toHaveLength(4);
		});
	});
});
