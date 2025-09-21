import React, { FC, useEffect } from 'react';
import { FileSystemProvider, useFileSystemContext } from './contexts';
import { ErrorBoundary } from './components';
import { FileExplorer } from './containers';

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
