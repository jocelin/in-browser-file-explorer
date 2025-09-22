import React, { FC, useEffect } from 'react';

import { ErrorBoundary } from '@file-explorer/components';
import { FileExplorer } from '@file-explorer/containers';
import {
	FileSystemProvider,
	useFileSystemContext,
} from '@file-explorer/contexts';

interface AppProps {
	name: string;
}

// Inner component that uses the context
const AppContent: FC = () => {
	const { initializeService } = useFileSystemContext();

	useEffect(() => {
		initializeService();
	}, [initializeService]);

	return <FileExplorer />;
};

export const App: FC<AppProps> = ({ name: _name }) => {
	return (
		<ErrorBoundary>
			<FileSystemProvider>
				<AppContent />
			</FileSystemProvider>
		</ErrorBoundary>
	);
};
