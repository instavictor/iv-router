var path = require('path');

// var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: 'IVRouter.js',
  output: {
    filename: 'ivRouter.js',
    path: path.resolve(__dirname, 'dist'),

    // path: 'dist',
    library: 'IVRouter',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: { 
        presets: [ 
          'es2015'
        ]
      }
    }]
  },

  plugins: [
    // new HtmlWebpackPlugin()
  ],

  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  }
};
