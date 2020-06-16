module.exports = {
  roots: ['<rootDir>/test/unit/'],
  moduleNameMapper: {
    // mock files that jest doesn't support like CSS and SVG files
    '\\.css$': '<rootDir>/test/module-mock.js',
    '\\.svg$': '<rootDir>/test/module-mock.js',
  },
  testMatch: ['**/?(*.)+(spec|test).[t]s'],
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['/node_modules/', 'dist', 'test'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['json', 'json-summary', 'lcov', 'text', 'text-summary', 'clover'],
  setupFiles: ['<rootDir>/test/unit/jest.globals.ts'],
};
