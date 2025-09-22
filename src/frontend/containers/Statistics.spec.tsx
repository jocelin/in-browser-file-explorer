import React from 'react';

import { render, screen } from '@testing-library/react';

import { Statistics } from '@file-explorer/containers';

// Mock the context
jest.mock('@file-explorer/contexts', () => ({
	useFileSystemContext: (): any => ({
		rootNode: {
			id: '1',
			name: 'Root',
			type: 'directory',
			parentId: null,
			children: ['2', '3'],
			createdAt: new Date(),
			modifiedAt: new Date(),
		},
	}),
}));

// Mock the hooks
jest.mock('@file-explorer/hooks', () => ({
	useStatistics: () => ({
		nodeCount: 100,
		directoryCount: 25,
		fileCount: 75,
	}),
}));

describe('Statistics', () => {
	it('renders statistics when root node exists', () => {
		render(<Statistics />);

		expect(screen.getByText('Statistics')).toBeInTheDocument();
		expect(screen.getByText('100')).toBeInTheDocument(); // Total Items
		expect(screen.getByText('25')).toBeInTheDocument(); // Directories
		expect(screen.getByText('75')).toBeInTheDocument(); // Files
	});

	it('renders nothing when no root node exists', () => {
		// Mock context to return null rootNode
		jest.doMock('@file-explorer/contexts', () => ({
			useFileSystemContext: (): any => ({
				rootNode: null,
			}),
		}));

		const { container } = render(<Statistics />);
		expect(container.firstChild).toBeNull();
	});
});
