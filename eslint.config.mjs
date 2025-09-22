import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
			},
		},
		plugins: {
			'@typescript-eslint': typescript,
			react: react,
			'react-hooks': reactHooks,
			import: importPlugin,
			prettier: prettier,
		},
		rules: {
			// Apply recommended rules from plugins
			...typescript.configs.recommended.rules,
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,

			// TypeScript specific rules (your original rules)
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_' },
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-non-null-assertion': 'warn',

			// React specific rules (your original rules)
			'react/react-in-jsx-scope': 'off', // Not needed with React 17+
			'react/prop-types': 'off', // Using TypeScript for prop validation
			'react/jsx-uses-react': 'off', // Not needed with React 17+
			'react/jsx-uses-vars': 'error',

			// General rules (your original rules)
			'no-console': 'warn',
			'no-debugger': 'warn',
			'prefer-const': 'error',
			'no-var': 'error',

			// Import ordering rules
			'import/order': [
				'error',
				{
					groups: [
						'builtin', // Node.js built-in modules
						'external', // npm packages
						'internal', // Internal modules (your aliases)
						'parent', // Parent directory imports
						'sibling', // Same directory imports
						'index', // Index file imports
					],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
					pathGroups: [
						{
							pattern: 'react',
							group: 'external',
							position: 'before',
						},
						{
							pattern: 'react-dom',
							group: 'external',
							position: 'before',
						},
						{
							pattern: '@file-explorer/**',
							group: 'internal',
							position: 'before',
						},
					],
					pathGroupsExcludedImportTypes: ['react', 'react-dom'],
				},
			],
			'import/no-duplicates': 'error',
			'import/no-unresolved': 'off', // TypeScript handles this

			// Prettier integration
			'prettier/prettier': 'error',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	// Configuration for test files (Jest)
	{
		files: [
			'**/*.{test,spec}.{js,jsx,ts,tsx}',
			'**/__tests__/**/*.{js,jsx,ts,tsx}',
		],
		languageOptions: {
			globals: {
				...globals.jest,
			},
		},
		rules: {
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-explicit-any': 'off', // Sometimes needed for mocking
			'no-console': 'off', // Console logs are often useful in tests
		},
	},
	{
		ignores: ['dist/', 'node_modules/', '*.js', '*.d.ts'],
	},
	// Disable ESLint rules that conflict with Prettier
	prettierConfig,
];
