import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { ControlButton } from './ControlButton';

describe('ControlButton', () => {
	const mockOnClick = jest.fn();

	beforeEach(() => {
		mockOnClick.mockClear();
	});

	it('renders and handles clicks', () => {
		render(
			<ControlButton onClick={mockOnClick} variant="primary">
				Click me
			</ControlButton>
		);

		const button = screen.getByRole('button', { name: /click me/i });
		expect(button).toBeInTheDocument();

		fireEvent.click(button);
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('disables correctly', () => {
		render(
			<ControlButton onClick={mockOnClick} variant="primary" disabled>
				Click me
			</ControlButton>
		);

		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
		expect(button).toHaveClass('cursor-not-allowed', 'bg-gray-100');

		fireEvent.click(button);
		expect(mockOnClick).not.toHaveBeenCalled();
	});

	it('applies size variants', () => {
		const { rerender } = render(
			<ControlButton onClick={mockOnClick} variant="primary" size="sm">
				Small
			</ControlButton>
		);
		expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5');

		rerender(
			<ControlButton onClick={mockOnClick} variant="primary" size="lg">
				Large
			</ControlButton>
		);
		expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-base');
	});

	it('applies variant styles when enabled', () => {
		const variants = [
			{
				variant: 'primary' as const,
				classes: ['border-blue-300', 'text-blue-600'],
			},
			{
				variant: 'secondary' as const,
				classes: ['border-gray-300', 'text-gray-600'],
			},
			{
				variant: 'danger' as const,
				classes: ['border-red-300', 'text-red-600'],
			},
			{
				variant: 'ghost' as const,
				classes: ['border-purple-300', 'text-purple-700'],
			},
		];

		variants.forEach(({ variant, classes }) => {
			render(
				<ControlButton onClick={mockOnClick} variant={variant}>
					{variant}
				</ControlButton>
			);

			const button = screen.getByRole('button', { name: variant });
			classes.forEach(cls => expect(button).toHaveClass(cls));
		});
	});

	it('defaults to medium size', () => {
		render(
			<ControlButton onClick={mockOnClick} variant="primary">
				Default
			</ControlButton>
		);

		expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');
	});

	it('includes base styling classes', () => {
		render(
			<ControlButton onClick={mockOnClick} variant="primary">
				Test
			</ControlButton>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass(
			'font-medium',
			'rounded-lg',
			'border',
			'inline-flex'
		);
	});
});
