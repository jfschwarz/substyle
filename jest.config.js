const path = require('path')

const r = p => path.resolve(__dirname, p)

module.exports = {
  testRegex: '\\.spec\\.js$',

  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['cobertura', 'lcov', 'text-summary'],
  coverageDirectory: '<rootDir>/coverage',
  setupFilesAfterEnv: [r('./jest/setupTestFramework.js')],
  setupFiles: ['raf/polyfill'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  transform: {
    '^.+\\.jsx?$': r('./jest/testTransformer.js'),
  },
}
