import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
	ReactNode,
} from 'react';
import { CreateNodeRequest, FileSystemNode, FileSystemError } from '../types';

// Core file system state type
interface FileSystemState {
	nodes: Map<string, FileSystemNode>;
	rootId: string | null;
	selectedNodeId: string | null;
}

// Initial state
const createInitialState = (): FileSystemState => ({
	nodes: new Map(),
	rootId: null,
	selectedNodeId: null,
});

// Simplified context interface
interface FileSystemContextValue {
	// State
	error: string | null;
	isLoading: boolean;

	// Actions
	initializeService: () => void;
	selectNode: (nodeId: string) => void;
	createNode: (request: CreateNodeRequest) => FileSystemNode | null;
	deleteNode: (nodeId: string) => void;
	createRoot: (name?: string) => FileSystemNode | null;
	resetFileSystem: () => void;
	setError: (error: string | null) => void;
	clearError: () => void;

	// Computed values
	selectedNode?: FileSystemNode | null;
	selectedNodeId: string | null;
	rootNode: FileSystemNode | null;
	allNodes: FileSystemNode[];
	getChildren: (parentId: string) => FileSystemNode[];
	getNode: (id: string) => FileSystemNode | null;
}

// Create context
const FileSystemContext = createContext<FileSystemContextValue | undefined>(
	undefined
);

// Provider component
interface FileSystemProviderProps {
	children: ReactNode;
}

export const FileSystemProvider: React.FC<FileSystemProviderProps> = ({
	children,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [state, setState] = useState<FileSystemState>(createInitialState);
	const [error, setError] = useState<string | null>(null);

	// Helper to create error
	const createError = useCallback(
		(code: FileSystemError['code'], message: string): FileSystemError => {
			const error = new Error(message) as FileSystemError;
			error.code = code;
			return error;
		},
		[]
	);

	// Helper to generate unique ID
	const generateId = useCallback((): string => {
		return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}, []);

	// Helper to execute operations with error handling
	const executeOperation = useCallback(<T,>(operation: () => T): T | null => {
		try {
			setError(null);
			return operation();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Operation failed';
			setError(errorMessage);
			return null;
		}
	}, []);

	// Core operations
	const selectNode = useCallback(
		(nodeId: string): void => {
			executeOperation(() => {
				setState(prev => {
					if (!prev.nodes.has(nodeId)) {
						throw createError(
							'NODE_NOT_FOUND',
							`Node with id ${nodeId} not found`
						);
					}
					return { ...prev, selectedNodeId: nodeId };
				});
			});
		},
		[createError, executeOperation]
	);

	const createNode = useCallback(
		(request: CreateNodeRequest): FileSystemNode | null => {
			return executeOperation(() => {
				const id = generateId();
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

				setState(prev => {
					// Validate parent exists if not creating root (empty parentId means root)
					// Check against the current state being updated, not stale closure
					if (
						request.parentId &&
						request.parentId !== '' &&
						!prev.nodes.has(request.parentId)
					) {
						throw createError(
							'NODE_NOT_FOUND',
							`Parent node with id ${request.parentId} not found`
						);
					}

					const newNodes = new Map(prev.nodes);
					newNodes.set(id, newNode);

					// Add to parent's children if not root
					if (request.parentId && request.parentId !== '') {
						const parent = newNodes.get(request.parentId);
						if (parent) {
							parent.children.push(id);
							parent.modifiedAt = now;
						}
					}

					return {
						...prev,
						nodes: newNodes,
						rootId: request.parentId === '' ? id : prev.rootId,
					};
				});

				return newNode;
			});
		},
		[generateId, createError, executeOperation]
	);

	const deleteNode = useCallback(
		(nodeId: string): void => {
			executeOperation(() => {
				const node = state.nodes.get(nodeId);
				if (!node) {
					throw createError(
						'NODE_NOT_FOUND',
						`Node with id ${nodeId} not found`
					);
				}

				if (nodeId === state.rootId) {
					throw createError('ROOT_DELETE', 'Cannot delete root node');
				}

				setState(prev => {
					const newNodes = new Map(prev.nodes);

					// Recursively delete all children
					const deleteRecursive = (id: string) => {
						const nodeToDelete = newNodes.get(id);
						if (!nodeToDelete) return;

						// Delete all children first
						for (const childId of nodeToDelete.children) {
							deleteRecursive(childId);
						}

						// Delete the node itself
						newNodes.delete(id);
					};

					deleteRecursive(nodeId);

					// Remove from parent's children
					if (node.parentId) {
						const parent = newNodes.get(node.parentId);
						if (parent) {
							parent.children = parent.children.filter(
								childId => childId !== nodeId
							);
							parent.modifiedAt = new Date();
						}
					}

					return {
						...prev,
						nodes: newNodes,
						selectedNodeId:
							prev.selectedNodeId === nodeId ? null : prev.selectedNodeId,
					};
				});
			});
		},
		[state.nodes, state.rootId, createError, executeOperation]
	);

	const resetFileSystem = useCallback((): void => {
		setState(createInitialState());
		setError(null);
	}, []);

	// Error management
	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const createRoot = useCallback(
		(name: string = 'Root'): FileSystemNode | null => {
			return executeOperation(() => {
				// If root exists, reset the file system first
				if (state.rootId) {
					resetFileSystem();
				}

				const result = createNode({
					name,
					type: 'directory',
					parentId: '', // Empty string indicates root
				});

				if (!result) {
					throw new Error('Failed to create root directory');
				}

				return result;
			});
		},
		[state.rootId, createNode, resetFileSystem, executeOperation]
	);

	// Initialize service (now just a no-op since we use hooks)
	const initializeService = useCallback(() => {
		setIsLoading(true);
		try {
			// No longer need to create a service instance
			clearError();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to initialize service'
			);
		} finally {
			setIsLoading(false);
		}
	}, [clearError]);

	// Computed values
	const selectedNode = useMemo(() => {
		if (!state.selectedNodeId) return null;
		return state.nodes.get(state.selectedNodeId) || null;
	}, [state.selectedNodeId, state.nodes]);

	const rootNode = useMemo(() => {
		if (!state.rootId) return null;
		return state.nodes.get(state.rootId) || null;
	}, [state.rootId, state.nodes]);

	const allNodes = useMemo(() => {
		return Array.from(state.nodes.values());
	}, [state.nodes]);

	const getChildren = useCallback(
		(parentId: string): FileSystemNode[] => {
			const parent = state.nodes.get(parentId);
			if (!parent) return [];

			return parent.children
				.map(childId => state.nodes.get(childId))
				.filter((node): node is FileSystemNode => node !== undefined)
				.sort((a, b) => {
					// Directories first, then files, then alphabetically
					if (a.type !== b.type) {
						return a.type === 'directory' ? -1 : 1;
					}
					return a.name.localeCompare(b.name);
				});
		},
		[state.nodes]
	);

	const getNode = useCallback(
		(id: string): FileSystemNode | null => {
			return state.nodes.get(id) || null;
		},
		[state.nodes]
	);

	const contextValue: FileSystemContextValue = {
		error,
		isLoading,
		initializeService,
		selectNode,
		createNode,
		deleteNode,
		createRoot,
		resetFileSystem,
		setError,
		clearError,
		selectedNode,
		selectedNodeId: state.selectedNodeId,
		rootNode,
		allNodes,
		getChildren,
		getNode,
	};

	return (
		<FileSystemContext.Provider value={contextValue}>
			{children}
		</FileSystemContext.Provider>
	);
};

// Custom hook to use the context
export const useFileSystemContext = (): FileSystemContextValue => {
	const context = useContext(FileSystemContext);
	if (context === undefined) {
		throw new Error(
			'useFileSystemContext must be used within a FileSystemProvider'
		);
	}
	return context;
};
