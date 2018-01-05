'use strict';
/*eslint-env node*/
const _ = require('lodash');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var fs = require('fs');
var path = require('path');

module.exports = function makeWebpackConfig(options) {
    /**
     * Environment type
     * BUILD is for generating minified builds
     * TEST is for generating test builds
     */
    var BUILD = !!options.BUILD;
    var TEST = !!options.TEST;
    var DEV = !!options.DEV;

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    var config = {};

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    if(!TEST) {
        config.entry = {
            app: './client/app/app.js',
            polyfills: './client/app/polyfills.js',
            vendor: [
                'lodash'
            ]
        };
    }

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    if(TEST) {
        config.output = {};
    } else {
        config.output = {
            // Absolute output directory
            path: BUILD ? path.join(__dirname, '/dist/client/') : path.join(__dirname, '/.tmp/'),

            // Output path from the view of the page
            // Uses webpack-dev-server in development
            publicPath: BUILD || DEV ? '/' : `http://localhost:${8080}/`,
            //publicPath: BUILD ? '/' : 'http://localhost:' + env.port + '/',

            // Filename for entry points
            // Only adds hash in build mode
            filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

            // Filename for non-entry points
            // Only adds hash in build mode
            chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
        };
    }

    config.resolve = {
        modules: ['node_modules'],
        extensions: ['.js', '.ts'],
        alias: {
            primus: path.resolve(__dirname, 'client/components/socket/primus.js'),
        }
    };

    if(TEST) {
        config.resolve = {
            modules: [
                'node_modules'
            ],
            extensions: ['.js', '.ts'],
            alias: {
                // for some reason the primus client and webpack don't get along in test
                primus: path.resolve(__dirname, 'client/components/socket/primus.mock.js'),
            }
        };
    }

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if(TEST) {
        config.devtool = 'inline-source-map';
    } else if(BUILD || DEV) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval';
    }

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */

    // Initialize module
    config.module = {
        rules: [{
            // JS LOADER
            // Reference: https://github.com/babel/babel-loader
            // Transpile .js files using babel-loader
            // Compiles ES6 and ES7 into ES5 code
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    plugins: TEST ? ['istanbul'] : [],
                }
            }].concat(DEV ? '@angularclass/hmr-loader' : []),
            include: [
                path.resolve(__dirname, 'client/'),
                path.resolve(__dirname, 'server/config/environment/shared.js'),
                path.resolve(__dirname, 'node_modules/lodash-es/'),
            ]
        }, {
            // TS LOADER
            // Reference: https://github.com/s-panferov/awesome-typescript-loader
            // Transpile .ts files using awesome-typescript-loader
            test: /\.ts$/,
            use: [{
                loader: 'awesome-typescript-loader',

            }].concat(DEV ? '@angularclass/hmr-loader' : []),
            include: [
                path.resolve(__dirname, 'client/')
            ]
        }, {
            // ASSET LOADER
            // Reference: https://github.com/webpack/file-loader
            // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
            // Rename the file using the asset hash
            // Pass along the updated reference to your code
            // You can add here any file extension you want to get copied to your output
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([\?]?.*)$/,
            use: 'file-loader'
        }, {

            // HTML LOADER
            // Reference: https://github.com/webpack/raw-loader
            // Allow loading html through js
            test: /\.html$/,
            use: 'raw-loader'
        }, {
            // CSS LOADER
            // Reference: https://github.com/webpack/css-loader
            // Allow loading css through js
            //
            // Reference: https://github.com/postcss/postcss-loader
            // Postprocess your css with PostCSS plugins
            test: /\.css$/,
            use: ['raw-loader', 'css-loader', 'postcss-loader'],
            include: [
                path.resolve(__dirname, 'client')
            ]
        }, {
            // SASS LOADER
            // Reference: https://github.com/jtangelder/sass-loader
            test: /\.(scss|sass)$/,
            use: ['raw-loader', 'sass-loader'],
            include: [
                path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets/*.scss'),
                path.resolve(__dirname, 'client')
            ]


        }]
    };



    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Extract css files
        // Disabled when in test mode or not in build mode
        new ExtractTextPlugin({
            filename: '[name].[hash].css',
            disable: !BUILD || TEST,
        }),

        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname
            },
            sassLoader: {
                outputStyle: 'compressed',
                precision: 10,
                sourceComments: false
            },
            babel: {
                shouldPrintComment(commentContents) {
                    let regex = DEV
                        // keep `// @flow` & flow type comments in dev
                        ? /(@flow|^:)/
                        // strip comments
                        : false;
                    return regex.test(commentContents);
                },

            },
        }),
    ];

    if(!TEST) {
        config.plugins.push(new CommonsChunkPlugin({
            name: 'vendor',

            // filename: "vendor.js"
            // (Give the chunk a different name)

            minChunks: Infinity
            // (with more entries, this ensures that no other module
            //  goes into the vendor chunk)
        }));
    }

    // Skip rendering index.html in test mode
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    let htmlConfig = {
        template: 'client/_index.html',
        filename: '../client/index.html',
        alwaysWriteToDisk: true
    }
    config.plugins.push(
      new HtmlWebpackPlugin(htmlConfig),
      new HtmlWebpackHarddiskPlugin()
    );

    // Add build specific plugins
    if(BUILD) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            new webpack.optimize.DedupePlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            }),
        );
    }

    let localEnv;
    try {
        localEnv = require('./server/config/local.env').default;
    } catch(e) {
        localEnv = {};
    }
    localEnv = _.mapValues(localEnv, value => `"${value}"`);
    localEnv = _.mapKeys(localEnv, (value, key) => `process.env.${key}`);

    let env = _.merge({
        'process.env.NODE_ENV': DEV ? '"development"'
            : BUILD ? '"production"'
            : TEST ? '"test"'
            : '"development"'
    }, localEnv);

    // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    // Define free global variables
    config.plugins.push(new webpack.DefinePlugin(env));

    if(DEV) {
        config.plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );
    }

    config.cache = DEV;

    if(TEST) {
        config.stats = {
            colors: true,
            reasons: true
        };
    }

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        contentBase: './client/',
        hot: true,
        proxy: {
            '/api': {
                target: 'http://localhost:9000',
                secure: false,
            },
            '/auth': {
                target: 'http://localhost:9000',
                secure: false,
            },
            '/primus': {
                target: 'http://localhost:9000',
                secure: false,
                ws: true,
            },
        },
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunks: false,
        },
        historyApiFallback: true,
    };

    config.node = {
        global: true,
        process: true,
        crypto: false,
        clearImmediate: false,
        setImmediate: false
    };

    return config;
};
