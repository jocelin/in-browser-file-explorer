import React from 'react';
import { render, screen } from '@testing-library/react';

import { ErrorDisplay } from './ErrorDisplay';

describe('ErrorDisplay', () => {
	it('renders nothing when error is null', () => {
		const { container } = render(<ErrorDisplay error={null} />);
		expect(container.firstChild).toBeNull();
	});

	it('renders error message when error is provided', () => {
		render(<ErrorDisplay error="Something went wrong" />);
		expect(screen.getByText('Error:')).toBeInTheDocument();
		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
	});
});
