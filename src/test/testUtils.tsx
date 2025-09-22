import React from 'react';

import { FileSystemProvider, TreeProvider } from '@file-explorer/contexts';
import { FileSystemNode } from '@file-explorer/types';

// Test wrapper component that provides both FileSystemProvider and TreeProvider
export const TestWrapper: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	return (
		<FileSystemProvider>
			<TreeProvider>{children}</TreeProvider>
		</FileSystemProvider>
	);
};

// Default test nodes
export const defaultTestNodes: FileSystemNode[] = [
	{
		id: '1',
		name: 'Root',
		type: 'directory',
		parentId: null,
		children: ['2', '3'],
		createdAt: new Date(),
		modifiedAt: new Date(),
	},
	{
		id: '2',
		name: 'File1.txt',
		type: 'file',
		parentId: '1',
		children: [],
		createdAt: new Date(),
		modifiedAt: new Date(),
	},
	{
		id: '3',
		name: 'Folder1',
		type: 'directory',
		parentId: '1',
		children: ['4'],
		createdAt: new Date(),
		modifiedAt: new Date(),
	},
	{
		id: '4',
		name: 'File2.txt',
		type: 'file',
		parentId: '3',
		children: [],
		createdAt: new Date(),
		modifiedAt: new Date(),
	},
];
