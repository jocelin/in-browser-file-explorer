import React from 'react';

import { render, screen } from '@testing-library/react';

import { ErrorBoundary } from '@file-explorer/components';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
	if (shouldThrow) {
		throw new Error('Test error');
	}
	return <div>No error</div>;
};

describe('ErrorBoundary', () => {
	beforeEach(() => {
		// Suppress console.error for these tests since we expect errors
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('renders children when there is no error', () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={false} />
			</ErrorBoundary>
		);

		expect(screen.getByText('No error')).toBeInTheDocument();
	});

	it('renders error message when there is an error', () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
	});

	it('renders custom error message when provided', () => {
		const customError = 'Custom error message';

		render(
			<ErrorBoundary fallback={<div>{customError}</div>}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		expect(screen.getByText(customError)).toBeInTheDocument();
	});

	it('logs error to console', () => {
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		expect(consoleSpy).toHaveBeenCalled();
	});
});
