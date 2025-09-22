import React from 'react';

import { useFileSystemContext } from '@file-explorer/contexts';
import { useStatistics } from '@file-explorer/hooks';

interface StatCardProps {
	icon?: string;
	value: number;
	label: string;
	iconColor?: string;
}

const StatCard = ({ icon, value, label, iconColor }: StatCardProps) => (
	<div className="text-center p-3 bg-white bg-opacity-60 rounded-lg border border-white border-opacity-50">
		<div className="flex items-center justify-center gap-1 mb-1">
			{icon && <span className={`${iconColor} text-sm`}>{icon}</span>}
			<div className="text-lg font-bold text-gray-800">
				{value.toLocaleString()}
			</div>
		</div>
		<div className="text-xs text-gray-600 font-medium">{label}</div>
	</div>
);

export const Statistics: React.FC = () => {
	const { rootNode } = useFileSystemContext();
	const { nodeCount, directoryCount, fileCount } = useStatistics();

	// Only show statistics if there's a root node
	if (!rootNode) {
		return null;
	}

	return (
		<div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6 shadow-sm">
			<div className="flex items-center gap-2 mb-4">
				<h3 className="text-lg font-semibold text-gray-800">Statistics</h3>
			</div>

			<div className="grid grid-cols-3 gap-3">
				<StatCard value={nodeCount} label="Total Items" />
				<StatCard
					icon="📁"
					value={directoryCount}
					label="Directories"
					iconColor="text-amber-600"
				/>
				<StatCard
					icon="📄"
					value={fileCount}
					label="Files"
					iconColor="text-green-600"
				/>
			</div>
		</div>
	);
};
