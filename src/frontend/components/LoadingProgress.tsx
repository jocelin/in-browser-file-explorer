import React from 'react';

interface LoadingProgressProps {
	isLoading: boolean;
	progress: {
		current: number;
		total: number;
	};
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
	isLoading,
	progress,
}) => {
	if (!isLoading) {
		return null;
	}

	return (
		<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6 mb-6">
			<div className="flex items-center mb-4">
				<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
				<span className="text-blue-800 font-medium text-lg">
					Generating Files...
				</span>
			</div>

			{progress.total > 0 && (
				<div className="space-y-2">
					<div className="flex justify-between text-sm text-blue-700">
						<span>Progress</span>
						<span>
							{progress.current.toLocaleString()} /{' '}
							{progress.total.toLocaleString()}
						</span>
					</div>
					<div className="w-full bg-blue-200 rounded-full h-2">
						<div
							className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
							style={{
								width: `${(progress.current / progress.total) * 100}%`,
							}}
						></div>
					</div>
					<div className="text-xs text-blue-600 text-center">
						{Math.round((progress.current / progress.total) * 100)}% Complete
					</div>
				</div>
			)}
		</div>
	);
};
