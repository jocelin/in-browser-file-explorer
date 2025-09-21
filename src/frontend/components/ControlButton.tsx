import React from 'react';

import { ButtonClass, ButtonSize, ButtonVariant } from '../types';

interface ControlButtonProps extends React.ComponentProps<'button'> {
	onClick: () => void;
	disabled?: boolean;
	variant?: ButtonVariant;
	size?: ButtonSize;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
	onClick,
	disabled = false,
	variant = 'primary',
	children,
	size = 'md',
}) => {
	const buttonClasses = `${ButtonClass.size[size]} ${ButtonClass.variants[variant]}`;

	return (
		<button onClick={onClick} disabled={disabled} className={buttonClasses}>
			{children}
		</button>
	);
};
