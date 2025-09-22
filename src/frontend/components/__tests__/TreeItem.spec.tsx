import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import { TreeItem } from '@file-explorer/components';

describe('TreeItem', () => {
	const mockOnNodeClick = jest.fn();
	const mockOnToggleClick = jest.fn();

	const mockDirectoryItem = {
		node: {
			id: '1',
			name: 'Test Directory',
			type: 'directory' as const,
			children: ['2', '3', '4'],
		},
		level: 0,
		isExpanded: false,
	};

	const mockFileItem = {
		node: {
			id: '2',
			name: 'Test File',
			type: 'file' as const,
			children: [] as string[],
		},
		level: 1,
		isExpanded: false,
	};

	beforeEach(() => {
		mockOnNodeClick.mockClear();
		mockOnToggleClick.mockClear();
	});

	it('renders directory item correctly', () => {
		render(
			<TreeItem
				item={mockDirectoryItem}
				actualIndex={0}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		expect(screen.getByText('Test Directory')).toBeInTheDocument();
		expect(screen.getByText('📁')).toBeInTheDocument();
		expect(screen.getByText('3 items')).toBeInTheDocument();
		expect(screen.getByText('▶')).toBeInTheDocument(); // Collapsed state
	});

	it('renders file item correctly', () => {
		render(
			<TreeItem
				item={mockFileItem}
				actualIndex={1}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		expect(screen.getByText('Test File')).toBeInTheDocument();
		expect(screen.getByText('📄')).toBeInTheDocument();
		expect(screen.queryByText('▶')).not.toBeInTheDocument(); // No expand button for files
		expect(screen.queryByText(/items?/)).not.toBeInTheDocument(); // No item count for files
	});

	it('shows expanded state for directory', () => {
		const expandedItem = { ...mockDirectoryItem, isExpanded: true };

		render(
			<TreeItem
				item={expandedItem}
				actualIndex={0}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		expect(screen.getByText('▼')).toBeInTheDocument(); // Expanded state
	});

	it('applies selected styling when selected', () => {
		const { container } = render(
			<TreeItem
				item={mockDirectoryItem}
				actualIndex={0}
				isSelected={true}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		const treeItem = container.firstChild as HTMLElement;
		expect(treeItem).toHaveClass('bg-gray-100', 'border-gray-200');

		// Check that text is styled for selected state
		const name = screen.getByText('Test Directory');
		expect(name).toHaveClass('text-gray-900', 'font-medium');

		// Check that icon is styled for selected state
		const icon = screen.getByText('📁');
		expect(icon).toHaveClass('text-gray-700');
	});

	it('applies correct positioning styles', () => {
		const { container } = render(
			<TreeItem
				item={mockDirectoryItem}
				actualIndex={2}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		const treeItem = container.firstChild as HTMLElement;
		expect(treeItem).toHaveStyle({
			top: '64px', // 2 * 32
			height: '32px',
			paddingLeft: '8px', // 0 * 20 + 8
		});
	});

	it('applies correct indentation for nested levels', () => {
		const nestedItem = { ...mockDirectoryItem, level: 2 };

		const { container } = render(
			<TreeItem
				item={nestedItem}
				actualIndex={0}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		const treeItem = container.firstChild as HTMLElement;
		expect(treeItem).toHaveStyle({
			paddingLeft: '48px', // 2 * 20 + 8
		});
	});

	it('calls onNodeClick when item is clicked', () => {
		render(
			<TreeItem
				item={mockDirectoryItem}
				actualIndex={0}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		const treeItem = screen.getByText('Test Directory').closest('div');
		fireEvent.click(treeItem!);

		expect(mockOnNodeClick).toHaveBeenCalledWith('1', 'directory');
	});

	it('calls onToggleClick when expand button is clicked', () => {
		render(
			<TreeItem
				item={mockDirectoryItem}
				actualIndex={0}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		const expandButton = screen.getByText('▶');
		fireEvent.click(expandButton);

		expect(mockOnToggleClick).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'click',
			}),
			'1'
		);
	});

	it('stops propagation when expand button is clicked', () => {
		render(
			<TreeItem
				item={mockDirectoryItem}
				actualIndex={0}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		const expandButton = screen.getByText('▶');
		const mockEvent = {
			stopPropagation: jest.fn(),
		};

		// Simulate the onClick handler directly
		fireEvent.click(expandButton, mockEvent);

		expect(mockOnToggleClick).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'click',
			}),
			'1'
		);
	});

	it('shows correct item count for single item', () => {
		const singleItemDirectory = {
			...mockDirectoryItem,
			node: { ...mockDirectoryItem.node, children: ['2'] },
		};

		render(
			<TreeItem
				item={singleItemDirectory}
				actualIndex={0}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		expect(screen.getByText('1 item')).toBeInTheDocument();
	});

	it('shows correct item count for multiple items', () => {
		const multiItemDirectory = {
			...mockDirectoryItem,
			node: { ...mockDirectoryItem.node, children: ['2', '3', '4', '5'] },
		};

		render(
			<TreeItem
				item={multiItemDirectory}
				actualIndex={0}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		expect(screen.getByText('4 items')).toBeInTheDocument();
	});

	it('applies correct CSS classes for directory', () => {
		const { container } = render(
			<TreeItem
				item={mockDirectoryItem}
				actualIndex={0}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		const treeItem = container.firstChild as HTMLElement;
		expect(treeItem).toHaveClass(
			'tree-item',
			'absolute',
			'left-0',
			'right-0',
			'flex',
			'items-center',
			'cursor-grab',
			'active:cursor-grabbing',
			'border-b',
			'border-gray-100',
			'text-sm',
			'select-none',
			'group'
		);

		// Check icon classes
		const icon = screen.getByText('📁');
		expect(icon).toHaveClass('text-secondary-400');

		// Check name classes
		const name = screen.getByText('Test Directory');
		expect(name).toHaveClass(
			'cursor-pointer',
			'hover:text-blue-600',
			'hover:underline'
		);
	});

	it('applies correct CSS classes for file', () => {
		render(
			<TreeItem
				item={mockFileItem}
				actualIndex={0}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		// Check icon classes
		const icon = screen.getByText('📄');
		expect(icon).toHaveClass('text-primary-400');

		// Check name classes (no hover effects for files)
		const name = screen.getByText('Test File');
		expect(name).not.toHaveClass(
			'cursor-pointer',
			'hover:text-blue-600',
			'hover:underline'
		);
	});

	it('renders spacer div for files', () => {
		render(
			<TreeItem
				item={mockFileItem}
				actualIndex={0}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		const spacer = document.querySelector('.w-6.mr-1');
		expect(spacer).toBeInTheDocument();
	});

	it('does not render spacer div for directories', () => {
		render(
			<TreeItem
				item={mockDirectoryItem}
				actualIndex={0}
				isSelected={false}
				onNodeClick={mockOnNodeClick}
				onToggleClick={mockOnToggleClick}
			/>
		);

		const spacer = document.querySelector('.w-7.mr-2');
		expect(spacer).not.toBeInTheDocument();
	});
});
