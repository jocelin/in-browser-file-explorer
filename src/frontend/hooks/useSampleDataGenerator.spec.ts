import { renderHook, act } from '@testing-library/react';
import { useSampleDataGenerator } from './useSampleDataGenerator';

// Mock the useFileSystemContext hook
jest.mock('../contexts', () => ({
	useFileSystemContext: () => ({
		resetFileSystem: jest.fn(),
		createRoot: jest.fn().mockReturnValue({
			id: 'root-id',
			name: 'Root',
			type: 'directory',
			parentId: '',
			children: [] as string[],
			createdAt: new Date(),
			modifiedAt: new Date(),
		}),
		selectNode: jest.fn(),
		createNode: jest.fn().mockReturnValue({
			id: 'node-id',
			name: 'Test Node',
			type: 'file',
			parentId: 'root-id',
			children: [] as string[],
			createdAt: new Date(),
			modifiedAt: new Date(),
		}),
		setError: jest.fn(),
		clearError: jest.fn(),
		getNode: jest.fn().mockReturnValue({
			id: 'root-id',
			name: 'Root',
			type: 'directory',
			parentId: '',
			children: [] as string[],
			createdAt: new Date(),
			modifiedAt: new Date(),
		}),
		rootNode: {
			id: 'root-id',
			name: 'Root',
			type: 'directory',
			parentId: '',
			children: [] as string[],
			createdAt: new Date(),
			modifiedAt: new Date(),
		},
	}),
}));

describe('useSampleDataGenerator', () => {
	it('should provide generateExampleData function', () => {
		const { result } = renderHook(() => useSampleDataGenerator(null));

		expect(result.current.generateExampleData).toBeDefined();
		expect(typeof result.current.generateExampleData).toBe('function');
	});

	it('should call generateExampleData without errors', () => {
		const { result } = renderHook(() => useSampleDataGenerator(null));

		expect(() => {
			act(() => {
				result.current.generateExampleData();
			});
		}).not.toThrow();
	});
});
