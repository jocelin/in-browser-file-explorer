import { useCallback, useState } from 'react';

import { useFileSystemContext } from '@file-explorer/contexts';
import { FileSystemNode, NodeType } from '@file-explorer/types';

// Type for createNode function
type CreateNodeFunction = (node: {
	name: string;
	type: NodeType;
	parentId: string;
}) => FileSystemNode | null;

// Helper function to create a directory with error handling
const createDirectory = (
	name: string,
	parentId: string,
	createNode: CreateNodeFunction
): FileSystemNode | null => {
	const dir = createNode({
		name,
		type: 'directory',
		parentId,
	});
	if (!dir) {
		throw new Error(`Failed to create ${name} directory`);
	}
	return dir;
};

// Helper function to create a file
const createFile = (
	name: string,
	parentId: string,
	createNode: CreateNodeFunction
): void => {
	createNode({
		name,
		type: 'file',
		parentId,
	});
};

// Helper function to yield control back to the browser
const yieldToMain = (): Promise<void> => {
	return new Promise(resolve => {
		setTimeout(resolve, 0);
	});
};

// Helper function to generate large dataset asynchronously
const generateLargeDataset = async (
	parentId: string,
	createNode: CreateNodeFunction,
	onProgress?: (current: number, total: number) => void
): Promise<void> => {
	const totalFiles = 10000;
	const batchSize = 100; // Process files in batches of 100

	// Create nested directory structure
	const subdirs: string[] = [];
	for (let i = 0; i < 10; i++) {
		const subdir = createNode({
			name: `Subdirectory_${i.toString().padStart(2, '0')}`,
			type: 'directory',
			parentId,
		});
		if (subdir) {
			subdirs.push(subdir.id);
		}
	}

	// Distribute files across subdirectories in batches
	for (let i = 0; i < totalFiles; i += batchSize) {
		const batchEnd = Math.min(i + batchSize, totalFiles);

		// Process current batch
		for (let j = i; j < batchEnd; j++) {
			const subdirIndex = j % subdirs.length;
			const fileName = `file_${j.toString().padStart(5, '0')}.txt`;

			createNode({
				name: fileName,
				type: 'file',
				parentId: subdirs[subdirIndex],
			});

			// Create some nested subdirectories for complexity
			if (j % 100 === 0 && j > 0) {
				const nestedDir = createNode({
					name: `Nested_${j}`,
					type: 'directory',
					parentId: subdirs[subdirIndex],
				});

				// Add some files to nested directories
				if (nestedDir) {
					for (let k = 0; k < 10; k++) {
						createNode({
							name: `nested_file_${k}.txt`,
							type: 'file',
							parentId: nestedDir.id,
						});
					}
				}
			}
		}

		// Update progress
		if (onProgress) {
			onProgress(batchEnd, totalFiles);
		}

		// Yield control back to the browser to prevent freezing
		await yieldToMain();
	}
};

// Helper function to create basic file structure
const createBasicStructure = async (
	root: FileSystemNode,
	includeLargeDataset: boolean,
	createNode: CreateNodeFunction,
	onProgress?: (current: number, total: number) => void
): Promise<void> => {
	// Create main directories
	const docsDir = createDirectory('Documents', root.id, createNode);
	const picsDir = createDirectory('Pictures', root.id, createNode);
	const projectsDir = createDirectory('Projects', root.id, createNode);

	if (!docsDir || !picsDir || !projectsDir) {
		throw new Error('Failed to create main directories');
	}

	// Create subdirectories
	const workDir = createDirectory('Work', docsDir.id, createNode);
	const personalDir = createDirectory('Personal', docsDir.id, createNode);

	if (!workDir || !personalDir) {
		throw new Error('Failed to create subdirectories');
	}

	// Create some files
	createFile('readme.txt', root.id, createNode);
	createFile('config.json', root.id, createNode);
	createFile('notes.md', docsDir.id, createNode);
	createFile('report.pdf', workDir.id, createNode);
	createFile('my file.pdf', personalDir.id, createNode);
	createFile('vacation.jpg', picsDir.id, createNode);

	// Generate 10K files in nested structure for performance testing (only if requested)
	if (includeLargeDataset) {
		await generateLargeDataset(projectsDir.id, createNode, onProgress);
	}
};

/**
 * Hook for generating sample data
 * Provides a clean interface for generating example file system structures
 */
export const useSampleDataGenerator = (root: FileSystemNode | null) => {
	const { selectNode, createNode, setError, clearError, allNodes } =
		useFileSystemContext();

	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState({ current: 0, total: 0 });

	const generateExampleData = useCallback(async () => {
		if (!root) {
			setError('No root node available');
			return;
		}

		// Check if there's only a single root node
		if (allNodes.length > 1) {
			setError(
				'Cannot generate example data when there are existing files or directories. Please reset the file system first.'
			);
			return;
		}

		setIsLoading(true);
		setProgress({ current: 0, total: 10000 });

		try {
			selectNode(root.id);
			await createBasicStructure(root, true, createNode, (current, total) => {
				setProgress({ current, total });
			});
			clearError();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Failed to generate example data';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
			setProgress({ current: 0, total: 0 });
		}
	}, [root, selectNode, createNode, setError, clearError, allNodes]);

	return {
		generateExampleData,
		isLoading,
		progress,
	};
};
