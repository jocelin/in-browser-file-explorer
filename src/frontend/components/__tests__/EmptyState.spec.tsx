import React from 'react';

import { render, screen } from '@testing-library/react';

import { EmptyState } from '@file-explorer/components';

describe('EmptyState', () => {
	it('renders empty state message', () => {
		render(<EmptyState />);
		expect(
			screen.getByText(
				'No file system initialized. Click "Create Root Directory" to get started.'
			)
		).toBeInTheDocument();
	});
});
