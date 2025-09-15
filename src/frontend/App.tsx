import React, { useState, useEffect, FC } from 'react';

interface AppProps {
	name: string;
}

export const App: FC<AppProps> = ({ name }) => {
	const [time, setTime] = useState<string | null>(null);

	const getTime = async () => {
		const response = await fetch('/api/time', { method: 'GET' });
		if (response.ok) {
			setTime(await response.text());
		}
	};

	useEffect(() => {
		getTime();
		const interval = setInterval(getTime, 2000);

		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<h1>{name}</h1>
			<div>{time}</div>
		</>
	);
};
