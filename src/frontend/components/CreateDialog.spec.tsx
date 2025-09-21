import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { CreateDialog } from './CreateDialog';

const mockProps = {
	isOpen: true,
	createNodeType: 'file' as const,
	newNodeName: '',
	selectedNode: {
		id: '1',
		name: 'test-folder',
		type: 'directory' as const,
		parentId: null as string | null,
		children: [] as string[],
		createdAt: new Date(),
		modifiedAt: new Date(),
	},
	onClose: jest.fn(),
	onCreateNodeTypeChange: jest.fn(),
	onNewNodeNameChange: jest.fn(),
	onCreateNode: jest.fn(),
};

describe('CreateDialog', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders nothing when closed', () => {
		render(<CreateDialog {...mockProps} isOpen={false} />);
		expect(screen.queryByText('Create New Item')).not.toBeInTheDocument();
	});

	it('renders dialog when open', () => {
		render(<CreateDialog {...mockProps} />);
		expect(screen.getByText('Create New Item')).toBeInTheDocument();
	});

	it('calls onCreateNodeTypeChange when radio buttons are clicked', () => {
		render(<CreateDialog {...mockProps} />);
		fireEvent.click(screen.getByLabelText('Directory'));
		expect(mockProps.onCreateNodeTypeChange).toHaveBeenCalledWith('directory');
	});

	it('calls onNewNodeNameChange when typing in input', () => {
		render(<CreateDialog {...mockProps} />);
		const input = screen.getByPlaceholderText('Enter file name...');
		fireEvent.change(input, { target: { value: 'test.txt' } });
		expect(mockProps.onNewNodeNameChange).toHaveBeenCalledWith('test.txt');
	});

	it('calls onCreateNode when Enter key is pressed', () => {
		render(<CreateDialog {...mockProps} />);
		const input = screen.getByPlaceholderText('Enter file name...');
		fireEvent.keyDown(input, { key: 'Enter' });
		expect(mockProps.onCreateNode).toHaveBeenCalled();
	});

	it('calls onClose when Cancel button is clicked', () => {
		render(<CreateDialog {...mockProps} />);
		fireEvent.click(screen.getByText('Cancel'));
		expect(mockProps.onClose).toHaveBeenCalled();
	});

	it('calls onCreateNode when Create button is clicked', () => {
		render(<CreateDialog {...mockProps} />);
		fireEvent.click(screen.getByText('Create'));
		expect(mockProps.onCreateNode).toHaveBeenCalled();
	});
});
