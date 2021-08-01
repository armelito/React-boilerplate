const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
const config = require('./webpack.config')

module.exports = merge(config, {
  // Mode
  mode: 'production',
  // Output path
  output:
  {
    path: path.join(__dirname, '../public')
  },
  // Plugins
  plugins:
  [
    new CleanWebpackPlugin()
  ]
})
