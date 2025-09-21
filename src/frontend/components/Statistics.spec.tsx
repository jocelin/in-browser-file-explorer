import React from 'react';
import { render, screen } from '@testing-library/react';

import { Statistics } from './Statistics';

describe('Statistics Component', () => {
	const defaultProps = {
		nodeCount: 100,
		directoryCount: 25,
		fileCount: 75,
	};

	it('renders all statistics with correct values and labels', () => {
		render(<Statistics {...defaultProps} />);

		expect(screen.getByText('Statistics')).toBeInTheDocument();
		expect(screen.getByText('100')).toBeInTheDocument();
		expect(screen.getByText('Total Items')).toBeInTheDocument();
		expect(screen.getByText('25')).toBeInTheDocument();
		expect(screen.getByText('Directories')).toBeInTheDocument();
		expect(screen.getByText('75')).toBeInTheDocument();
		expect(screen.getByText('Files')).toBeInTheDocument();
	});

	it('displays icons for directories and files', () => {
		render(<Statistics {...defaultProps} />);

		expect(screen.getByText('📁')).toBeInTheDocument();
		expect(screen.getByText('📄')).toBeInTheDocument();
	});

	it('formats large numbers with commas', () => {
		const largeProps = {
			nodeCount: 1234567,
			directoryCount: 12345,
			fileCount: 1222222,
		};

		render(<Statistics {...largeProps} />);

		expect(screen.getByText('1,234,567')).toBeInTheDocument();
		expect(screen.getByText('12,345')).toBeInTheDocument();
		expect(screen.getByText('1,222,222')).toBeInTheDocument();
	});

	it('handles zero values', () => {
		const zeroProps = {
			nodeCount: 0,
			directoryCount: 0,
			fileCount: 0,
		};

		render(<Statistics {...zeroProps} />);

		const zeroValues = screen.getAllByText('0');
		expect(zeroValues).toHaveLength(3);
	});

	it('applies basic styling classes', () => {
		const { container } = render(<Statistics {...defaultProps} />);
		const mainDiv = container.firstChild;

		expect(mainDiv).toHaveClass('rounded-xl', 'p-6');
	});

	it('renders as a proper heading', () => {
		render(<Statistics {...defaultProps} />);
		const heading = screen.getByRole('heading', { level: 3 });
		expect(heading).toHaveTextContent('Statistics');
	});
});
