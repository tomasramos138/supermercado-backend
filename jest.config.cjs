module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/tests/**/*.test.ts', '**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    // mapea imports que terminan en .js a sus fuentes TypeScript durante testing si usas import './file.js'
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transformIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        useESM: true
      }
    ]
  }
};