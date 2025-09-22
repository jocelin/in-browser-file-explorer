import React from 'react';

import { render, screen } from '@testing-library/react';

import { LoadingProgress } from '@file-explorer/components';

describe('LoadingProgress', () => {
	const defaultProps = {
		isLoading: true,
		progress: {
			current: 5,
			total: 10,
		},
	};

	it('renders loading message', () => {
		render(<LoadingProgress {...defaultProps} />);

		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('renders with custom message', () => {
		const customMessage = 'Processing files...';

		render(<LoadingProgress {...defaultProps} text={customMessage} />);

		expect(screen.getByText(customMessage)).toBeInTheDocument();
	});

	it('shows progress information', () => {
		render(<LoadingProgress {...defaultProps} />);

		expect(screen.getByText('Progress')).toBeInTheDocument();
		expect(screen.getByText('5 / 10')).toBeInTheDocument();
		expect(screen.getByText('50% Complete')).toBeInTheDocument();
	});

	it('does not render when not loading', () => {
		render(<LoadingProgress {...defaultProps} isLoading={false} />);

		expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
	});

	it('handles zero progress', () => {
		const zeroProgressProps = {
			...defaultProps,
			progress: {
				current: 0,
				total: 10,
			},
		};

		render(<LoadingProgress {...zeroProgressProps} />);

		expect(screen.getByText('0 / 10')).toBeInTheDocument();
		expect(screen.getByText('0% Complete')).toBeInTheDocument();
	});

	it('handles complete progress', () => {
		const completeProgressProps = {
			...defaultProps,
			progress: {
				current: 10,
				total: 10,
			},
		};

		render(<LoadingProgress {...completeProgressProps} />);

		expect(screen.getByText('10 / 10')).toBeInTheDocument();
		expect(screen.getByText('100% Complete')).toBeInTheDocument();
	});

	it('handles zero total gracefully', () => {
		const zeroTotalProps = {
			...defaultProps,
			progress: {
				current: 5,
				total: 0,
			},
		};

		render(<LoadingProgress {...zeroTotalProps} />);

		expect(screen.getByText('Loading...')).toBeInTheDocument();
		expect(screen.queryByText('Progress')).not.toBeInTheDocument();
	});
});
