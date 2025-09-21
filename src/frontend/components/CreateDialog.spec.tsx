import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { CreateDialog } from './CreateDialog';

// Mock the context
jest.mock('../contexts', () => ({
	useFileSystemContext: (): any => ({
		selectedNode: {
			id: '1',
			name: 'Test Directory',
			type: 'directory',
			parentId: null,
			children: [],
			createdAt: new Date(),
			modifiedAt: new Date(),
		},
		createNode: jest.fn(),
	}),
}));

// Mock the types
jest.mock('../types', () => ({
	ButtonClass: {
		size: {
			md: 'px-4 py-2',
		},
		variants: {
			primary: 'bg-blue-600 text-white',
			secondary: 'bg-gray-200 text-gray-800',
		},
	},
}));

describe('CreateDialog', () => {
	const mockOnClose = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders dialog when open', () => {
		render(<CreateDialog isOpen={true} onClose={mockOnClose} />);

		expect(screen.getByText('Create New Item')).toBeInTheDocument();
		expect(screen.getByText('Type:')).toBeInTheDocument();
		expect(screen.getByText('Name:')).toBeInTheDocument();
	});

	it('does not render when closed', () => {
		render(<CreateDialog isOpen={false} onClose={mockOnClose} />);

		expect(screen.queryByText('Create New Item')).not.toBeInTheDocument();
	});

	it('renders file and directory radio buttons', () => {
		render(<CreateDialog isOpen={true} onClose={mockOnClose} />);

		expect(screen.getByLabelText('File')).toBeInTheDocument();
		expect(screen.getByLabelText('Directory')).toBeInTheDocument();
	});

	it('renders cancel and create buttons', () => {
		render(<CreateDialog isOpen={true} onClose={mockOnClose} />);

		expect(screen.getByText('Cancel')).toBeInTheDocument();
		expect(screen.getByText('Create')).toBeInTheDocument();
	});

	it('calls onClose when cancel button is clicked', () => {
		render(<CreateDialog isOpen={true} onClose={mockOnClose} />);

		fireEvent.click(screen.getByText('Cancel'));

		expect(mockOnClose).toHaveBeenCalled();
	});

	it('resets form when dialog opens', () => {
		const { rerender } = render(
			<CreateDialog isOpen={false} onClose={mockOnClose} />
		);

		// Open dialog
		rerender(<CreateDialog isOpen={true} onClose={mockOnClose} />);

		// Check that form is reset (file type selected by default)
		expect(screen.getByLabelText('File')).toBeChecked();
		expect(screen.getByPlaceholderText('Enter file name...')).toHaveValue('');
	});
});
