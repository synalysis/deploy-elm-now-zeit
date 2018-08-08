var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const prod = 'production';
const dev = 'development';

// determine build env
const TARGET_ENV = process.env.npm_lifecycle_event === 'build' ? prod : dev;
const isDev = TARGET_ENV == dev;
const isProd = TARGET_ENV == prod;

// entry and output path/filename variables
const entryPath = path.join(__dirname, 'src/static/index.js');
const outputPath = path.join(__dirname, 'dist');
const outputFilename = isProd ? '[name]-[hash].js' : '[name].js'

console.log('WEBPACK GO! Building for ' + TARGET_ENV);

// common webpack config (valid for dev and prod)
var commonConfig = {
    output: {
        path: outputPath,
        filename: `static/js/${outputFilename}`,
    },
    resolve: {
        extensions: ['.js', '.elm'],
        modules: ['node_modules']
    },
    module: {
        noParse: /\.elm$/,
        rules: [{
            test: /\.(eot|ttf|woff|woff2|svg)$/,
            use: 'file-loader?publicPath=../../&name=static/css/[hash].[ext]'
        }]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer()]
            }
        }),
        new HtmlWebpackPlugin({
            template: 'src/static/index.html',
            inject: 'body',
            filename: 'index.html'
        })
    ]
}

// additional webpack settings for local env (when invoked by 'npm start')
if (isDev === true) {
    module.exports = merge(commonConfig, {
        entry: [
            'webpack-dev-server/client?http://localhost:8080',
            entryPath
        ],
        devServer: {
            // serve index.html in place of 404 responses
            historyApiFallback: true,
            contentBase: './src',
            hot: true
        },
        module: {
            rules: [{
                test: /\.elm$/,
                exclude: [/elm-stuff/, /node_modules/],
                use: [{
                    loader: 'elm-webpack-loader',
                    options: {
                        verbose: true,
                        warn: true,
                        debug: true
                    }
                }]
            },{
                test: /\.sc?ss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            }]
        }
    });
}

// additional webpack settings for prod env (when invoked via 'npm run build')
if (isProd === true) {
    module.exports = merge(commonConfig, {
        entry: entryPath,
        module: {
            rules: [{
                test: /\.elm$/,
                exclude: [/elm-stuff/, /node_modules/],
                use: [{
                    loader: 'elm-webpack-loader',
                    options: {
                        verbose: true,
                        warn: true,
                        debug: true
                    }
                }]
            },
            {
              test: /\.scss$/,
              use: [
								"style-loader",
                "css-loader",
								"sass-loader"
              ]
            },
            {
              test: /\.css$/,
              use: [
                MiniCssExtractPlugin.loader,
								"css-loader"
              ]
            }
          ]
        },
        plugins: [
            new CopyWebpackPlugin(
              [{
                 from: 'src/static/img/',
                 to: 'static/img/'
               }, {
                 from: 'src/favicon.ico'
               }, {
								 from: 'src/static/*.json',
								 to: 'static',
								 flatten: true
               }
              ]
            ),
			      new MiniCssExtractPlugin({
              // Options similar to the same options in webpackOptions.output
              // both options are optional
              filename: "[name].css",
              chunkFilename: "[id].css"
            })
				],

        optimization: {
            minimizer: [
              // we specify a custom UglifyJsPlugin here to get source maps in production
              new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                  compress: false,
                  ecma: 6,
                  mangle: true
                },
                sourceMap: true
              }),
              new OptimizeCSSAssetsPlugin({})
            ]
        }
    });
}
