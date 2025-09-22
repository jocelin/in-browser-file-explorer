import { renderHook } from '@testing-library/react';

import { useStatistics } from '@file-explorer/hooks';

// Mock the FileSystemService
const mockFileSystem = {
	allNodes: [] as any[],
	getAllNodes: jest.fn(),
};

jest.mock('@file-explorer/contexts', () => ({
	useFileSystemContext: () => mockFileSystem,
}));

describe('useStatistics', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('calculates statistics for empty file system', () => {
		mockFileSystem.allNodes = [];

		const { result } = renderHook(() => useStatistics());

		expect(result.current.nodeCount).toBe(0);
		expect(result.current.directoryCount).toBe(0);
		expect(result.current.fileCount).toBe(0);
	});

	it('calculates statistics for file system with mixed content', () => {
		mockFileSystem.allNodes = [
			{ id: '1', name: 'root', type: 'directory', children: ['2', '3'] },
			{ id: '2', name: 'file1.txt', type: 'file' },
			{ id: '3', name: 'folder1', type: 'directory', children: ['4'] },
			{ id: '4', name: 'file2.txt', type: 'file' },
		];

		const { result } = renderHook(() => useStatistics());

		expect(result.current.nodeCount).toBe(4);
		expect(result.current.directoryCount).toBe(2);
		expect(result.current.fileCount).toBe(2);
	});

	it('calculates statistics for file system with only directories', () => {
		mockFileSystem.allNodes = [
			{ id: '1', name: 'root', type: 'directory', children: ['2'] },
			{ id: '2', name: 'folder1', type: 'directory', children: ['3'] },
			{ id: '3', name: 'folder2', type: 'directory' },
		];

		const { result } = renderHook(() => useStatistics());

		expect(result.current.nodeCount).toBe(3);
		expect(result.current.directoryCount).toBe(3);
		expect(result.current.fileCount).toBe(0);
	});

	it('calculates statistics for file system with only files', () => {
		mockFileSystem.allNodes = [
			{ id: '1', name: 'file1.txt', type: 'file' },
			{ id: '2', name: 'file2.txt', type: 'file' },
			{ id: '3', name: 'file3.txt', type: 'file' },
		];

		const { result } = renderHook(() => useStatistics());

		expect(result.current.nodeCount).toBe(3);
		expect(result.current.directoryCount).toBe(0);
		expect(result.current.fileCount).toBe(3);
	});

	it('updates statistics when file system changes', () => {
		mockFileSystem.allNodes = [
			{ id: '1', name: 'root', type: 'directory', children: ['2'] },
			{ id: '2', name: 'file1.txt', type: 'file' },
		];

		const { result, rerender } = renderHook(() => useStatistics());

		expect(result.current.nodeCount).toBe(2);
		expect(result.current.directoryCount).toBe(1);
		expect(result.current.fileCount).toBe(1);

		// Update the file system
		mockFileSystem.allNodes = [
			{ id: '1', name: 'root', type: 'directory', children: ['2', '3'] },
			{ id: '2', name: 'file1.txt', type: 'file' },
			{ id: '3', name: 'file2.txt', type: 'file' },
		];

		rerender();

		expect(result.current.nodeCount).toBe(3);
		expect(result.current.directoryCount).toBe(1);
		expect(result.current.fileCount).toBe(2);
	});

	it('handles nodes with undefined type gracefully', () => {
		mockFileSystem.allNodes = [
			{ id: '1', name: 'root', type: 'directory', children: ['2'] },
			{ id: '2', name: 'unknown', type: undefined },
		];

		const { result } = renderHook(() => useStatistics());

		expect(result.current.nodeCount).toBe(2);
		expect(result.current.directoryCount).toBe(1);
		expect(result.current.fileCount).toBe(0);
	});
});
