const { NODE_ENV } = process.env

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: NODE_ENV === 'test' ? 'auto' : false,
        targets: {
          browsers: [
            'chrome >= 50',
            'firefox >= 52',
            'safari >= 10',
            'ie >= 11',
          ],
        },
      },
    ],
    '@babel/react',
  ],
  plugins: [
    '@babel/transform-runtime',
    '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-proposal-class-properties',
  ],
}
