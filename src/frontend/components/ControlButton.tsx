import React from 'react';

interface ControlButtonProps {
	onClick: () => void;
	disabled?: boolean;
	variant: 'primary' | 'secondary' | 'danger' | 'ghost';
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
		'font-medium transition-all duration-150 ease-out border focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2';

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm rounded-md min-h-[32px]',
		md: 'px-4 py-2 text-sm rounded-lg min-h-[40px]',
		lg: 'px-6 py-3 text-base rounded-lg min-h-[44px]',
	};

	const variantClasses = {
		primary: disabled
			? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
			: 'bg-white border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 active:bg-blue-100 focus:ring-blue-300 shadow-sm hover:shadow-md',

		secondary: disabled
			? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
			: 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 focus:ring-gray-300 shadow-sm hover:shadow-md',

		danger: disabled
			? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
			: 'bg-white border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 active:bg-red-100 focus:ring-red-300 shadow-sm hover:shadow-md',

		ghost: disabled
			? 'bg-transparent border-transparent text-gray-400 cursor-not-allowed'
			: 'bg-transparent border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 active:bg-purple-100 focus:ring-purple-300',
	};

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
		>
			{children}
		</button>
	);
};
