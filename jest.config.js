module.exports = {
  roots: ['<rootDir>/test/unit/'],
  testMatch: ['**/?(*.)+(spec|test).[t]s'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
