import React from 'react';

interface ErrorDisplayProps {
	error: string | null;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
	if (!error) {
		return null;
	}

	return (
		<div className="bg-red-50 text-red-800 p-3 rounded-md mb-5 border border-red-200">
			<strong>Error:</strong> {error}
		</div>
	);
};
