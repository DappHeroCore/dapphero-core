module.exports = {
  preset: 'jest-puppeteer',
  roots: [ '<rootDir>/src' ],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
  globals: { URL: 'http://localhost:3000' },
}
