import React from 'react';

export const EmptyState: React.FC = () => (
	<div className="text-center p-10 text-gray-600 bg-gray-50 rounded-md border border-gray-200">
		No file system initialized. Click "Create Root Directory" to get started.
	</div>
);
