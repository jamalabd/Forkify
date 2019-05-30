/* jshint esversion: 6 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  optimization: {
    concatenateModules: false,
    providedExports: false,
    usedExports: false
  },
  entry: ['babel-polyfill','./src/js/index.js'],
  output: {
    path: path.resolve(__dirname +'./dist'),
    filename: './js/bundle.js',
    globalObject: 'self'
  },
  devServer: {
    contentBase: './dist'
  },
  plugins:[
    new HtmlWebpackPlugin({
      filename:'index.html',
      template: './src/index.html'
    })
  ],
  module: {
    rules:[
      {test:/\.js$/, exclude: /node_modules/, use: {loader: 'babel-loader'}}
    ]
  }
};
