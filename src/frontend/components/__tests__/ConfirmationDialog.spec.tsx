import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import { ConfirmationDialog } from '@file-explorer/components';

describe('ConfirmationDialog', () => {
	const mockOnConfirm = jest.fn();
	const mockOnCancel = jest.fn();

	const defaultProps = {
		isOpen: true,
		title: 'Confirm Action',
		message: 'Are you sure you want to proceed?',
		confirmText: 'Yes',
		cancelText: 'No',
		onConfirm: mockOnConfirm,
		onCancel: mockOnCancel,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders when open', () => {
		render(<ConfirmationDialog {...defaultProps} />);

		expect(screen.getByText('Confirm Action')).toBeInTheDocument();
		expect(
			screen.getByText('Are you sure you want to proceed?')
		).toBeInTheDocument();
		expect(screen.getByText('Yes')).toBeInTheDocument();
		expect(screen.getByText('No')).toBeInTheDocument();
	});

	it('does not render when closed', () => {
		render(<ConfirmationDialog {...defaultProps} isOpen={false} />);

		expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
	});

	it('calls onConfirm when confirm button is clicked', () => {
		render(<ConfirmationDialog {...defaultProps} />);

		fireEvent.click(screen.getByText('Yes'));

		expect(mockOnConfirm).toHaveBeenCalledTimes(1);
	});

	it('calls onCancel when cancel button is clicked', () => {
		render(<ConfirmationDialog {...defaultProps} />);

		fireEvent.click(screen.getByText('No'));

		expect(mockOnCancel).toHaveBeenCalledTimes(1);
	});

	it('uses default button text when not provided', () => {
		const propsWithoutText = {
			...defaultProps,
			confirmText: undefined as any,
			cancelText: undefined as any,
		};

		render(<ConfirmationDialog {...propsWithoutText} />);

		expect(screen.getByText('Confirm')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
	});

	it('renders with custom button text', () => {
		const customProps = {
			...defaultProps,
			confirmText: 'Delete',
			cancelText: 'Keep',
		};

		render(<ConfirmationDialog {...customProps} />);

		expect(screen.getByText('Delete')).toBeInTheDocument();
		expect(screen.getByText('Keep')).toBeInTheDocument();
	});
});
