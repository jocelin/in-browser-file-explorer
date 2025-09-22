import React from 'react';

import { render, screen } from '@testing-library/react';

import { SelectedNodeInfo } from '@file-explorer/components';
import { FileSystemNode } from '@file-explorer/types';

const mockDirectoryNode: FileSystemNode = {
	id: '1',
	name: 'Test Directory',
	type: 'directory' as const,
	parentId: null,
	children: ['2', '3'],
	createdAt: new Date(),
	modifiedAt: new Date(),
};

const mockFileNode: FileSystemNode = {
	id: '2',
	name: 'Test File',
	type: 'file' as const,
	parentId: '1',
	children: [],
	createdAt: new Date(),
	modifiedAt: new Date(),
};

describe('SelectedNodeInfo', () => {
	it('renders selected directory information', () => {
		render(<SelectedNodeInfo selectedNode={mockDirectoryNode} />);

		expect(screen.getByText('Selected directory:')).toBeInTheDocument();
		expect(screen.getByText('📁 Test Directory')).toBeInTheDocument();
		expect(screen.getByText('2 items')).toBeInTheDocument();
	});

	it('renders selected file information', () => {
		render(<SelectedNodeInfo selectedNode={mockFileNode} />);

		expect(screen.getByText('Selected file:')).toBeInTheDocument();
		expect(screen.getByText('📄 Test File')).toBeInTheDocument();
	});

	it('renders nothing when no node is selected', () => {
		const { container } = render(<SelectedNodeInfo selectedNode={null} />);
		expect(container.firstChild).toBeNull();
	});

	it('renders root node name when name is empty', () => {
		const rootNode: FileSystemNode = {
			...mockDirectoryNode,
			name: '',
		};

		render(<SelectedNodeInfo selectedNode={rootNode} />);

		expect(screen.getByText('📁 Root')).toBeInTheDocument();
	});
});
