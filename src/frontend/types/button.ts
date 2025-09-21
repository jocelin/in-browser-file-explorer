/**
 * Button CSS class constants for direct usage
 * Base button styles are applied automatically to all buttons via CSS
 */

export const ButtonClass = {
	// Size variants
	size: {
		sm: 'btn--sm',
		md: 'btn--md',
		lg: 'btn--lg',
	},

	// Style variants
	variants: {
		primary: 'btn--primary',
		secondary: 'btn--secondary',
		danger: 'btn--danger',
		ghost: 'btn--ghost',
		outline: 'btn--outline',
	},
} as const;

// Type definitions for TypeScript support
export type ButtonSize = keyof typeof ButtonClass.size;
export type ButtonVariant = keyof typeof ButtonClass.variants;
