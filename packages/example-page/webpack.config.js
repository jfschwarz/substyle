const path = require('path')

const HTMLWebpackPlugin = require('html-webpack-plugin')
const HTMLWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'example.js',
    publicPath: '/',
  },
  plugins: [
    new HTMLWebpackPlugin({
      alwaysWriteToDisk: true,
      minify: true,
      template: './src/index.html',
      filename: path.resolve(__dirname, 'build/index.html'),
    }),
    new HTMLWebpackHarddiskPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { rootMode: 'upward' },
      },
    ],
  },
}
