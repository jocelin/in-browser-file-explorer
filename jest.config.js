module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
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
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/**/*.d.ts',
		'!src/test-setup.ts',
		'!src/backend/main.ts',
		'!src/backend/main.legacy.ts',
		'!src/frontend/main.ts',
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	moduleFileExtensions: ['ts', 'js', 'json'],
	// setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
};
