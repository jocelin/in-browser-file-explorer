export default {
	preset: 'ts-jest',
	projects: [
		{
			displayName: 'backend',
			testEnvironment: 'node',
			roots: ['<rootDir>/src/backend'],
			testMatch: ['**/*.spec.ts', '**/*.test.ts'],
			transform: {
				'^.+\\.ts$': [
					'ts-jest',
					{
						tsconfig: {
							module: 'es2020',
						},
					},
				],
			},
		},
		{
			displayName: 'frontend',
			testEnvironment: 'jsdom',
			roots: ['<rootDir>/src/frontend'],
			testMatch: ['**/*.spec.(ts|tsx)', '**/*.test.(ts|tsx)'],
			setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
			transform: {
				'^.+\\.(ts|tsx)$': [
					'ts-jest',
					{
						tsconfig: {
							module: 'es2020',
						},
					},
				],
			},
		},
	],
	verbose: true,
	collectCoverageFrom: [
		'src/**/*.(ts|tsx)',
		'!src/test/*',
		'!**/*.(spec|test).(ts|tsx)',
		'!src/**/*.d.ts',
		'!src/**/index.ts',
		'!src/backend/main.ts',
		'!src/frontend/main.tsx',
		'!src/frontend/types/**',
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
};
