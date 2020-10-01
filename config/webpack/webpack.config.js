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

const path = require('path');
const webpack = require('webpack');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const WebpackBar = require('webpackbar');

const ROOT_PATH = path.resolve(__dirname, '../..');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const devtool = IS_PRODUCTION ? false : 'source-map';
const TEMP_PATH = path.join(ROOT_PATH, './node_modules/.tmp');

module.exports = {
  mode: IS_PRODUCTION ? 'production' : 'development',
  devtool,
  entry: './src/index.js',
  output: {
    path: path.resolve(ROOT_PATH, 'dist'),
    publicPath: '/dist/',
    filename: 'vue-graph-editor.min.js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.vue', '.js'],
    symlinks: false,
    alias: {
      '@': path.resolve(ROOT_PATH, 'src'),
      vue$: 'vue/dist/vue.runtime.esm.js',
    },
    modules: ['node_modules', path.resolve(ROOT_PATH, 'node_modules')],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          },
        },
      },
      // Load CSS files: css-loader, then minify, then apply vue style loader.
      {
        test: /\.scss$/,
        use: ['vue-style-loader', MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /node_modules\/mxgraph\/javascript\/mxClient\.js$/,
        loader: 'exports-loader',
        options: {
          type: 'commonjs',
          exports: [
            'mxClient,mxToolbar,mxEdgeStyle,mxConnectionHandler,mxEllipse,mxConnectionConstraint,mxWindow,' +
            'mxObjectCodec,mxGraphModel,mxActor,mxPopupMenu,mxShape,mxEventObject,mxGraph,mxPopupMenuHandler,mxPrintPreview,' +
            'mxEventSource,mxRectangle,mxVertexHandler,mxMouseEvent,mxGraphView,mxCodecRegistry,mxImage,mxGeometry,mxCellState,' +
            'mxRubberband,mxConstraintHandler,mxKeyHandler,mxDragSource,mxGraphModel,mxEvent,mxUtils,mxEvent,mxCodec,mxCell,' +
            'mxConstants,mxPoint,mxGraphHandler,mxCylinder,mxCellRenderer,mxEvent,mxUndoManager,mxStencilRegistry,mxStencil,' +
            'mxText,mxSvgCanvas2D,mxCellHighlight,mxStackLayout,mxConnector,mxEdgeHandler,mxGuide,mxCellEditor,' +
            'mxSelectionCellsHandler,mxOutline,mxPanningHandler,mxResources,mxLayoutManager,mxRectangleShape,mxDictionary,' +
            'mxClipboard,mxGeometryChange,mxValueChange,mxPolyline,mxImageShape,mxElbowEdgeHandler,mxObjectIdentity,' +
            'mxStyleRegistry,mxGraphLayout,mxLine,mxHandle,mxSwimlane,mxCylinder,mxActor,mxRectangleShape,mxRhombus,mxLabel,' +
            'mxTriangle,mxHexagon,mxCloud,mxArrow,mxRectangleShape,mxPerimeter,mxDoubleEllipse,mxArrowConnector,' +
            'mxMarker,mxStylesheet',
          ],
        },
      },
      {
        test: /(default\.xml|grapheditor.txt)$/,
        loader: 'raw-loader',
      },
    ],
  },
  plugins: [

    // cleanup dist dir
    new CleanWebpackPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),

    new CaseSensitivePathsPlugin(),

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(ROOT_PATH, 'public'),
          globOptions: {
            ignore: ['.DS_Store'],
          },
          to: path.resolve(ROOT_PATH, 'dist/public'),
          toType: 'dir',
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: 'vue-graph-editor.min.css',
    }),

    // enable vue-loader to use existing loader rules for other module types
    new VueLoaderPlugin(),

    new WebpackBar({
      name: 'webpack ten9',
    }),
  ],

  optimization: {
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

  performance: {
    hints: false,
  },

  devtool,
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
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
