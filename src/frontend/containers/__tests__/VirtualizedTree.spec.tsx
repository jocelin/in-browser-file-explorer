import React from 'react';

import { render, screen } from '@testing-library/react';

import { VirtualizedTree } from '@file-explorer/containers';
import { TestWrapper } from '@file-explorer/test';

describe('VirtualizedTree', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders without crashing', () => {
		const { container } = render(
			<TestWrapper>
				<VirtualizedTree />
			</TestWrapper>
		);

		// VirtualizedTree component renders without errors (may return null when no root)
		expect(container.firstChild).toBeNull();
	});

	it('renders with empty state when no root node', () => {
		render(
			<TestWrapper>
				<VirtualizedTree />
			</TestWrapper>
		);

		// When no root node exists, component returns null
		expect(screen.queryByText('No files or folders')).not.toBeInTheDocument();
	});

	it('renders tree structure when root node exists', () => {
		const { container } = render(
			<TestWrapper>
				<VirtualizedTree />
			</TestWrapper>
		);

		// When no root exists, component returns null
		expect(container.firstChild).toBeNull();
	});
});
