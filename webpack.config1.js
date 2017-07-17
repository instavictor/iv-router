var webpack = require('webpack');

var isDevEnabled = (process.argv.indexOf('-p') < 0) && JSON.parse(process.env.BUILD_DEV || true);

// Macros for environment builds and debugging
var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(isDevEnabled),
  'process.env.NODE_ENV': (!isDevEnabled) ? '"production"' : '"dev"'
});

if (isDevEnabled) {
  console.log('WARNING YOU ARE IN DEV MODE');
}

var babelLoader = {
	test: /\.js$/,
	include: /(src)/,
	loader: 'babel',
	query: {
		presets: ['es2015']
	}
}

var loaders = [babelLoader];

var outputFilename = 'ivRouter';
outputFilename += (!isDevEnabled) ? '.min' : '';
outputFilename += '.js';

var plugins = [];
plugins.push(definePlugin);

module.exports = {
	entry: './src/IVRouter.js',
	output: {
		path: 'dist',
		library: 'IVRouter',
		libraryTarget: 'umd',
		umdNamedDefine: true,
		filename: outputFilename
	},

	module: {
		loaders: loaders
	},

	plugins: plugins,
};
