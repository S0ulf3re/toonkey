/**
 * webpack configuration
 */

import * as fs from 'fs';
import * as webpack from 'webpack';
const { VueLoaderPlugin } = require('vue-loader');

class WebpackOnBuildPlugin {
	constructor(readonly callback: (stats: any) => void) {
	}

	public apply(compiler: any) {
		compiler.hooks.done.tap('WebpackOnBuildPlugin', this.callback);
	}
}

const isProduction = process.env.NODE_ENV === 'production';

const locales = require('./locales');
const meta = require('./package.json');

const postcss = {
	loader: 'postcss-loader',
	options: {
		plugins: [
			require('cssnano')({
				preset: 'default'
			})
		]
	},
};

module.exports = {
	entry: {
		app: './src/client/init.ts',
		sw: './src/client/sw.ts'
	},
	module: {
		rules: [{
			test: /\.vue$/,
			exclude: /node_modules/,
			use: [{
				loader: 'vue-loader',
				options: {
					cssSourceMap: false,
					compilerOptions: {
						preserveWhitespace: false
					}
				}
			}, {
				loader: 'vue-svg-inline-loader-corejs3'
			}]
		}, {
			test: /\.scss?$/,
			exclude: /node_modules/,
			oneOf: [{
				resourceQuery: /module/,
				use: [{
					loader: 'vue-style-loader'
				}, {
					loader: 'css-loader',
					options: {
						modules: true
					}
				}, postcss, {
					loader: 'sass-loader',
					options: {
						implementation: require('sass'),
						sassOptions: {
							fiber: require('fibers')
						}
					}
				}]
			}, {
				use: [{
					loader: 'vue-style-loader'
				}, {
					loader: 'css-loader'
				}, postcss, {
					loader: 'sass-loader',
					options: {
						implementation: require('sass'),
						sassOptions: {
							fiber: require('fibers')
						}
					}
				}]
			}]
		}, {
			test: /\.css$/,
			use: [{
				loader: 'vue-style-loader'
			}, {
				loader: 'css-loader'
			}, postcss]
		}, {
			test: /\.(eot|woff|woff2|svg|ttf)([?]?.*)$/,
			loader: 'url-loader'
		}, {
			test: /\.json5$/,
			loader: 'json5-loader',
			options: {
				esModule: false,
			},
			type: 'javascript/auto'
		}, {
			test: /\.ts$/,
			exclude: /node_modules/,
			use: [{
				loader: 'ts-loader',
				options: {
					happyPackMode: true,
					transpileOnly: true,
					configFile: __dirname + '/src/client/tsconfig.json',
					appendTsSuffixTo: [/\.vue$/]
				}
			}]
		}]
	},
	plugins: [
		new webpack.ProgressPlugin({}),
		new webpack.DefinePlugin({
			_VERSION_: JSON.stringify(meta.version),
			_LANGS_: JSON.stringify(Object.entries(locales).map(([k, v]: [string, any]) => [k, v._lang_])),
			_ENV_: JSON.stringify(process.env.NODE_ENV)
		}),
		new VueLoaderPlugin(),
		new WebpackOnBuildPlugin((stats: any) => {
			fs.writeFileSync('./built/meta.json', JSON.stringify({ version: meta.version }), 'utf-8');
		}),
	],
	output: {
		path: __dirname + '/built/client/assets',
		filename: `[name].${meta.version}.js`,
		publicPath: `/assets/`
	},
	resolve: {
		extensions: [
			'.js', '.ts', '.json'
		],
		alias: {
			'const.styl': __dirname + '/src/client/const.styl'
		}
	},
	resolveLoader: {
		modules: ['node_modules']
	},
	cache: false,
	devtool: false, //'source-map',
	mode: isProduction ? 'production' : 'development'
};
