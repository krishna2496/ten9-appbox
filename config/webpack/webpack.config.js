/**
 * ten9, Inc
 * Copyright (c) 2015 - 2020 ten9, Inc
 * -----
 * NOTICE:  All information contained herein is, and remains
 * the property of ten9 Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to ten9 Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from ten9 Incorporated.
 * -----
 */

/* eslint-disable no-process-env */
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const path = require('path');
const ROOT_PATH = path.resolve(__dirname, '../..');
const DEV_SERVER_HOST = process.env.DEV_SERVER_HOST || 'localhost';
const devPort = 8080;
const DEV_SERVER_PORT = parseInt(process.env.DEV_SERVER_PORT, 10) || devPort;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEV_SERVER = process.env.WEBPACK_DEV_SERVER === 'true';
const DEV_SERVER_LIVERELOAD = IS_DEV_SERVER && process.env.DEV_SERVER_LIVERELOAD !== 'false';
const devtool = IS_PRODUCTION ? false : 'source-map';

const TEMP_PATH = path.join(ROOT_PATH, './node_modules/.tmp');

module.exports = {
  name: 'graph-editor',

  mode: IS_PRODUCTION ? 'production' : 'development',

  devtool,

  entry: {
    app: ['./src/main.ts'],
  },

  output: {
    path: path.resolve(ROOT_PATH, 'dist'),
    publicPath: '/',
    filename: IS_PRODUCTION ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
    chunkFilename: IS_PRODUCTION ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
    globalObject: 'this', // allow HMR and web workers to play nice
  },

  resolve: {
    extensions: ['.vue', '.js', '.jsx', '.svg'],
    symlinks: false,
    alias: {
      '@': path.resolve(ROOT_PATH, 'src'),
      vue$: 'vue/dist/vue.runtime.esm.js',
      '~images': path.resolve(ROOT_PATH, 'src/graph_editor/assets/images'),
    },
    modules: ['node_modules', path.resolve(ROOT_PATH, 'node_modules')],
  },

  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },

  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
        options: {
          hotReload: true, // enables Hot Reload
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the 'scss' and 'sass' values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          },
        },
      },

      // Run babel-loader on Javascript files to compile to compatible browser version.
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // include: [path.resolve(ROOT_PATH, 'src')],
      },

      // Load CSS files: css-loader, then minify, then apply vue style loader.
      {
        test: /\.(less|css)$/,
        use: [
          'vue-style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          'css-loader',
          'less-loader',
        ],
      },

      // Load SCSS files
      //   1. Use sass-loader to compoile SCSS to CSS with options for resolving paths within dependencies
      //   2. Use css-loader to resolve import statements within CSS and add to bundle
      //   3. Use the MiniCssExtractPlugin's loader to separate CSS into separate files
      //   4. Finally, apply vue-style-loader to dynamically inject CSS into document as style tags
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(ROOT_PATH, 'node_modules')],
              },
            },
          },
        ],
      },

      // Use pug-plain-loader to handle pug templates within vue files.
      // This compiles pug to HTML and to be used alongside vue-loader.
      // This will apply this loader to all <template lang="pug"> blocks
      // in our Vue components.
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },

      // Use vue-svg-loader on inline SVGs and external SVGs.
      // We will only run one of the rule sets depending if the SVG is inlined or external.
      {
        test: /\.(svg)(\?.*)?$/,
        oneOf: [
          // inline svgs
          {
            resourceQuery: /inline/,
            use: [
              {
                loader: 'babel-loader',
              },
              {
                loader: 'vue-svg-loader',
              },
            ],
          },
          // external svgs
          {
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: IS_PRODUCTION
                    ? 'assets/[name].[contenthash:8].[ext]'
                    : 'assets/[name].[ext]',
                  esModule: false,
                },
              },
            ],
          },
        ],
      },

      // Use url-loader to convert fonts to data URIs. Use file-loader if the file is larger than 2K.
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048,
              esModule: false,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: IS_PRODUCTION ? 'fonts/[name].[contenthash:8].[ext]' : 'fonts/[name].[ext]',
                  esModule: false,
                },
              },
            },
          },
        ],
      },

      // ts-loader transpiles Typescript code to Javascript.
      // The transpileOnly option speeds things up as there is no type checking done.
      // It is to be used in conjunction with the ForkTSCheckerPlugin to do the type
      // checking in a separate process to speed things up.
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
        },
      },

      // We bundle these raw files and so we don't have to download separately at runtime
      {
        test: /(default\.xml|en\.txt)$/,
        loader: 'raw-loader',
      },
      // Use url-loader to convert images to data URIs. Use file-loader if the file is larger than 2K.
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048,
              esModule: false,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: IS_PRODUCTION ? 'img/[name].[contenthash:8].[ext]' : 'img/[name].[ext]',
                  esModule: false,
                },
              },
            },
          },
        ],
      },
      // // We bundle these image files and so we don't have to downaload separately at runtime
      // {
      //   test: /\.(jpg|png)$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name].[ext]',
      //         outputPath: 'img/',
      //         publicPath: 'img/',
      //       },
      //     },
      //   ],
      // },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
    minimize: IS_PRODUCTION,
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: true,
          banner: false,
        },
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },

  plugins: [
    // cleanup dist dir
    new CleanWebpackPlugin(),

    // enable vue-loader to use existing loader rules for other module types
    new VueLoaderPlugin(),

    // We need our own progress bar plugin since --progress only works when running from commmand line
    new WebpackBar({
      name: 'webpack ten9',
      color: '#114D8B',
    }),

    // Add our config vars
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${process.env.NODE_ENV}"`,
        BASE_URL: '"/"',
      },
    }),

    new CaseSensitivePathsPlugin(),

    new ESLintPlugin({
      extensions: ['js', 'ts', 'vue'],
    }),

    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`ten9-webapp is running here http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}`],
      },
    }),

    new MiniCssExtractPlugin({
      filename: IS_PRODUCTION ? 'css/[name].[contenthash:8].css' : 'css/[name].css',
      chunkFilename: IS_PRODUCTION ? 'css/[id].[contenthash:8].css' : 'css/[id].css',
    }),

    new HtmlWebpackPlugin({
      title: 'diagram-editor',
      minify: IS_PRODUCTION
        ? {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
          }
        : false,
      template: path.resolve(ROOT_PATH, 'public/index.html'),
    }),

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(ROOT_PATH, 'public'),
          globOptions: {
            ignore: ['.DS_Store', '**/index.html'],
          },
          to: path.resolve(ROOT_PATH, 'dist'),
          toType: 'dir',
        },
      ],
    }),

    new ForkTsCheckerWebpackPlugin({
      typescript: {
        tslint: false,
        checkSyntacticErrors: IS_PRODUCTION,
        measureCompilationTime: true,
        enabled: true,
        memoryLimit: 4096,
        formatter: 'codeframe',
        configFile: 'tsconfig.json',
        files: './src/**/*.{vue,ts,tsx,js,jsx}',
        build: IS_PRODUCTION,
        extensions: {
          vue: {
            enabled: true,
            compiler: 'vue-template-compiler',
          },
        },
      },
    }),
  ],

  devServer: {
    hot: !IS_PRODUCTION && DEV_SERVER_LIVERELOAD,
    liveReload: !IS_PRODUCTION && DEV_SERVER_LIVERELOAD,
    clientLogLevel: 'warn',
    contentBase: 'dist',
    compress: true,
    host: DEV_SERVER_HOST,
    port: DEV_SERVER_PORT,
    overlay: { warnings: false, errors: true },
    publicPath: '/',
    quiet: true,
    stats: { colors: true },
    historyApiFallback: {
      disableDotRule: true,
    },
    noInfo: false,
  },

  watchOptions: {
    ignored: [
      '.lintcache',
      '.git/**',
      '.vscode/**',
      'coverage/**',
      'node_modules/**',
      'dist/**',
      'tests/**',
      '**/*.md',
    ],
  },
};

if (IS_PRODUCTION) {
  module.exports.plugins.push(
    new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.join(TEMP_PATH, 'reports/webpack-report.html'),
      openAnalyzer: false,
    }),
  );
}
