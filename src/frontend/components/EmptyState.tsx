import React from 'react';

interface EmptyStateProps extends React.ComponentProps<'div'> {
	message?: string;
	actionText?: string;
	onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
	message = 'No file system initialized. Click "Create Root Directory" to get started.',
	actionText,
	onAction,
}) => (
	<div className="text-center p-10 text-gray-600 bg-gray-50 rounded-md border border-gray-200">
		{message}
		{actionText && onAction && (
			<button
				onClick={onAction}
				className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
			>
				{actionText}
			</button>
		)}
	</div>
);
