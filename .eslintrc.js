export default {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react', '@typescript-eslint'],
	rules: {
		// TypeScript specific rules
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-non-null-assertion': 'warn',

		// React specific rules
		'react/react-in-jsx-scope': 'off', // Not needed with React 17+
		'react/prop-types': 'off', // Using TypeScript for prop validation
		'react/jsx-uses-react': 'off', // Not needed with React 17+
		'react/jsx-uses-vars': 'error',

		// General rules
		'no-console': 'warn',
		'no-debugger': 'warn',
		'prefer-const': 'error',
		'no-var': 'error',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	ignorePatterns: ['dist/', 'node_modules/', '*.js', '*.d.ts'],
};
