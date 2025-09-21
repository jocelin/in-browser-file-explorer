import { useMemo } from 'react';
import { useFileSystemContext } from '../contexts';
import { FileSystemNode } from '../types';

// Get node statistics
const getStatistics = (nodes: FileSystemNode[]) => {
	const total = nodes.length;
	const directories = nodes.filter(n => n.type === 'directory').length;
	const files = nodes.filter(n => n.type === 'file').length;

	return { total, directories, files };
};

export interface UseStatisticsReturn {
	nodeCount: number;
	directoryCount: number;
	fileCount: number;
}

/**
 * Hook for statistics with memoization
 * Computes and memoizes file system statistics
 */
export const useStatistics = (): UseStatisticsReturn => {
	const { allNodes } = useFileSystemContext();

	return useMemo(() => {
		const stats = getStatistics(allNodes);
		return {
			nodeCount: stats.total,
			directoryCount: stats.directories,
			fileCount: stats.files,
		};
	}, [allNodes]);
};
