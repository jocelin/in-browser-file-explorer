import React, { FC } from 'react';
import { FileExplorer } from './containers';

interface AppProps {
	name: string;
}

export const App: FC<AppProps> = ({ name: _name }) => {
	return <FileExplorer />;
};
