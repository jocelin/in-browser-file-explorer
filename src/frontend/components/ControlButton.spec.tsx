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
		expect(button).toHaveClass('btn--md', 'btn--primary');

		fireEvent.click(button);
		expect(mockOnClick).not.toHaveBeenCalled();
	});

	it('applies size variants', () => {
		const { rerender } = render(
			<ControlButton onClick={mockOnClick} variant="primary" size="sm">
				Small
			</ControlButton>
		);
		expect(screen.getByRole('button')).toHaveClass('btn--sm', 'btn--primary');

		rerender(
			<ControlButton onClick={mockOnClick} variant="primary" size="lg">
				Large
			</ControlButton>
		);
		expect(screen.getByRole('button')).toHaveClass('btn--lg', 'btn--primary');
	});

	it('applies variant styles when enabled', () => {
		const variants = [
			{
				variant: 'primary' as const,
				classes: ['btn--primary'],
			},
			{
				variant: 'secondary' as const,
				classes: ['btn--secondary'],
			},
			{
				variant: 'danger' as const,
				classes: ['btn--danger'],
			},
			{
				variant: 'ghost' as const,
				classes: ['btn--ghost'],
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

		expect(screen.getByRole('button')).toHaveClass('btn--md', 'btn--primary');
	});

	it('includes base styling classes', () => {
		render(
			<ControlButton onClick={mockOnClick} variant="primary">
				Test
			</ControlButton>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('btn--md', 'btn--primary');
	});
});
