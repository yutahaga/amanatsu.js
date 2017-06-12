const path = require('path')
const webpack = require('webpack')

const dir = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
}

module.exports = {
  entry: {
    'amanatsu': path.join(dir.src, 'index.js'),
    'amanatsu-loader': path.join(dir.src, 'loader.js')
  },
  output: {
    path: dir.dist,
    filename: '[name].js',
    publicPath: '/',
    library: 'Amanatsu',
    libraryTarget: 'window'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: dir.src,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: dir.src
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
  devServer: {
    contentBase: 'dist/',
    port: 3000
  },
  devtool: 'source-map'
}
