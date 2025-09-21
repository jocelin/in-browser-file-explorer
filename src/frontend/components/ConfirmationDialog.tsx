import React from 'react';

import { ButtonClass } from '../types';

interface ConfirmationDialogProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
	isOpen,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	onConfirm,
	onCancel,
}) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 backdrop-invert backdrop-opacity-20 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-200">
				<h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
				<p className="text-gray-600 mb-6">{message}</p>
				<div className="flex justify-end space-x-3">
					<button
						onClick={onCancel}
						className={`${ButtonClass.size.md} ${ButtonClass.variants.secondary}`}
					>
						{cancelText}
					</button>
					<button
						onClick={onConfirm}
						className={`${ButtonClass.size.md} ${ButtonClass.variants.danger}`}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};
