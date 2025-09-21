import { useState, useCallback } from 'react';
import { NodeType } from '../types/fileSystem';

// Check if node name is valid
const isValidNodeName = (name: string): boolean => {
	if (!name || name.trim() === '') return false;
	if (name.includes('/') || name.includes('\\')) return false;
	if (name.length > 255) return false; // Common filesystem limit
	return true;
};

export interface UseCreateDialogReturn {
	isOpen: boolean;
	nodeType: NodeType;
	nodeName: string;
	openDialog: () => void;
	closeDialog: () => void;
	resetForm: () => void;
	setNodeType: (type: NodeType) => void;
	setNodeName: (name: string) => void;
}

/**
 * Hook for managing create dialog state with form validation
 * Handles dialog open/close state, form data, and validation
 */
export const useCreateDialog = (): UseCreateDialogReturn => {
	const [isOpen, setIsOpen] = useState(false);
	const [nodeType, setNodeType] = useState<NodeType>('file');
	const [nodeName, setNodeName] = useState('');
	const [validationError, setValidationError] = useState<string | null>(null);

	const validateForm = useCallback((name: string, _type: NodeType) => {
		if (!isValidNodeName(name)) {
			setValidationError('Invalid node name');
			return false;
		}
		setValidationError(null);
		return true;
	}, []);

	const openDialog = useCallback(() => {
		setIsOpen(true);
		setNodeName('');
		setNodeType('file');
		setValidationError(null);
	}, []);

	const closeDialog = useCallback(() => {
		setIsOpen(false);
		setNodeName('');
		setNodeType('file');
		setValidationError(null);
	}, []);

	const resetForm = useCallback(() => {
		setNodeName('');
		setNodeType('file');
		setValidationError(null);
	}, []);

	const handleNodeNameChange = useCallback(
		(name: string) => {
			setNodeName(name);
			if (validationError) {
				validateForm(name, nodeType);
			}
		},
		[nodeType, validationError, validateForm]
	);

	const handleNodeTypeChange = useCallback(
		(type: NodeType) => {
			setNodeType(type);
			if (validationError) {
				validateForm(nodeName, type);
			}
		},
		[nodeName, validationError, validateForm]
	);

	return {
		isOpen,
		nodeType,
		nodeName,
		openDialog,
		closeDialog,
		resetForm,
		setNodeType: handleNodeTypeChange,
		setNodeName: handleNodeNameChange,
	};
};
