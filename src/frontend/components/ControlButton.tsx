import React from 'react';

interface ControlButtonProps {
	onClick: () => void;
	disabled?: boolean;
	variant: 'green' | 'blue' | 'red' | 'orange' | 'gray' | 'purple';
	children: React.ReactNode;
	size?: 'sm' | 'md' | 'lg';
}

export const ControlButton: React.FC<ControlButtonProps> = ({
	onClick,
	disabled = false,
	variant,
	children,
	size = 'md',
}) => {
	const baseClasses =
		'font-medium rounded-xl transition-all duration-200 transform border-2 shadow-sm active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50';

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2.5 text-sm',
		lg: 'px-6 py-3 text-base',
	};

	const variantClasses = {
		green: disabled
			? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed shadow-none'
			: 'cursor-pointer border-emerald-400 text-emerald-600 hover:from-emerald-600 hover:to-green-600 cursor hover:border-emerald-500 hover:shadow-md focus:ring-emerald-300',
		blue: disabled
			? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed shadow-none'
			: 'cursor-pointer border-blue-400 text-blue-600 hover:from-blue-600 hover:to-indigo-600 hover:border-blue-500 hover:shadow-md focus:ring-blue-300',
		red: disabled
			? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed shadow-none'
			: 'cursor-pointer border-red-300 text-red-600 hover:from-red-600 hover:to-rose-600 hover:border-red-500 hover:shadow-md focus:ring-red-300',
		purple:
			'cursor-pointer border-purple-300 text-purple-800 hover:from-purple-600 hover:to-violet-600 hover:border-purple-500 hover:shadow-md focus:ring-purple-300',
	};

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? '' : 'hover:-translate-y-0.5'}`}
		>
			{children}
		</button>
	);
};
