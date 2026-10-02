/** @type {import('jest').Config} */
module.exports = {
  preset: undefined,
  testEnvironment: 'jsdom',

  roots: ['<rootDir>/src'],

  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest'
  },

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',

    '^@pages$': '<rootDir>/src/pages',
    '^@components$': '<rootDir>/src/components',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices$': '<rootDir>/src/services/slices',
    '^@selectors$': '<rootDir>/src/services/selectors'
  },

  collectCoverageFrom: [
    'src/services/slices/**/*.{ts,tsx}',
    '!src/services/slices/**/__tests__/**',
    '!src/services/slices/index.ts'
  ],
  coverageDirectory: '<rootDir>/coverage'
};
