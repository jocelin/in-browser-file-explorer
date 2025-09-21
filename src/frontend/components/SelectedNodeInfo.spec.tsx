import React from 'react';
import { render, screen } from '@testing-library/react';

import { FileSystemNode } from '../types';
import { SelectedNodeInfo } from './SelectedNodeInfo';

const createMockNode = (
	overrides: Partial<FileSystemNode> = {}
): FileSystemNode => ({
	id: '1',
	name: 'test-node',
	type: 'file',
	parentId: null,
	children: [],
	createdAt: new Date(),
	modifiedAt: new Date(),
	...overrides,
});

describe('SelectedNodeInfo', () => {
	it('renders file node info', () => {
		const fileNode = createMockNode({ name: 'test.txt', type: 'file' });
		render(<SelectedNodeInfo selectedNode={fileNode} />);

		expect(screen.getByText('Selected file:')).toBeInTheDocument();
		expect(screen.getByText('📄 test.txt')).toBeInTheDocument();
	});

	it('renders directory node info with children count', () => {
		const dirNode = createMockNode({
			name: 'folder',
			type: 'directory',
			children: ['child1', 'child2', 'child3'],
		});
		render(<SelectedNodeInfo selectedNode={dirNode} />);

		expect(screen.getByText('Selected directory:')).toBeInTheDocument();
		expect(screen.getByText('📁 folder')).toBeInTheDocument();
		expect(screen.getByText('3 items')).toBeInTheDocument();
	});

	it('shows "Root" for empty name', () => {
		const rootNode = createMockNode({ name: '', type: 'directory' });
		render(<SelectedNodeInfo selectedNode={rootNode} />);

		expect(screen.getByText('📁 Root')).toBeInTheDocument();
	});

	it('does not show items count for file nodes', () => {
		const fileNode = createMockNode({ type: 'file' });
		render(<SelectedNodeInfo selectedNode={fileNode} />);

		expect(screen.queryByText(/items/)).not.toBeInTheDocument();
	});
});
