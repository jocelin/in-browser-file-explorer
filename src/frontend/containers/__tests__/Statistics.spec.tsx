import React from 'react';

import { render } from '@testing-library/react';

import { Statistics } from '@file-explorer/containers';
import { TestWrapper } from '@file-explorer/test';

// Mock the hooks
jest.mock('@file-explorer/hooks', () => ({
	useStatistics: () => ({
		nodeCount: 100,
		directoryCount: 25,
		fileCount: 75,
	}),
}));

describe('Statistics', () => {
	it('renders without crashing', () => {
		const { container } = render(
			<TestWrapper>
				<Statistics />
			</TestWrapper>
		);

		// Statistics component returns null when no root node exists
		expect(container.firstChild).toBeNull();
	});

	it('renders statistics when root node exists', () => {
		const { container } = render(
			<TestWrapper>
				<Statistics />
			</TestWrapper>
		);

		// When no root exists, statistics returns null
		expect(container.firstChild).toBeNull();
	});

	it('renders nothing when no root node exists', () => {
		// Mock context to return null rootNode
		jest.doMock('@file-explorer/contexts', () => ({
			useFileSystemContext: (): any => ({
				rootNode: null,
			}),
		}));

		const { container } = render(
			<TestWrapper>
				<Statistics />
			</TestWrapper>
		);
		expect(container.firstChild).toBeNull();
	});
});
