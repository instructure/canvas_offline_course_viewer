/* eslint no-var: "off" */

var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    bundle: './lib/index.js',
  },

  output: {
    path: path.join(__dirname, 'dist/viewer'),
    publicPath: '/viewer/',
    filename: '[name].js',
  },

  resolve: {
    root: [
      path.join(__dirname, 'lib'),
      path.join(__dirname, 'vendor'),
    ],
  },

  externals: {
    'course-data': 'COURSE_DATA',
  },

  postcss: function () {
    return [autoprefixer]
  },

  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
    }),
  ],

  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'eslint',
      include: [path.resolve('lib'), path.resolve('test')],
    }],

    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: [path.resolve('lib')],
      },
      { test: /\.json$/, loader: 'json', exclude: /node_modules/ },
      { test: /\.scss$/, loader: 'style!css!postcss!sass', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style!css!postcss', exclude: /node_modules/ },
      { test: /\.html$/, loader: 'file', query: { name: '../[name].[ext]' }, exclude: /node_modules/ },
    ],
  },

}
