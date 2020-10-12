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
// eslint-disable-next-line no-process-env
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
      // Loader for .vue files
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

      // Load SCSS files
      //   1. Use sass-loader to compoile SCSS to CSS with options for resolving paths within dependencies
      //   2. Use css-loader to resolve import statements within CSS and add to bundle
      //   3. Use the MiniCssExtractPlugin's loader to separate CSS into separate files
      //   4. Finally, apply vue-style-loader to dynamically inject CSS into document as style tags
      {
        test: /\.scss$/,
        use: ['vue-style-loader', MiniCssExtractPlugin.loader, 'css-loader'],
      },

      // Run babel-loader on Javascript files to compile to compatible browser version.
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },

      // Use exports-loader to add exports for mxClient.js objects since it doesn't export anything
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
              'mxMarker,mxStylesheet,mxForm,mxCircleLayout,mxFastOrganicLayout,mxCompactTreeLayout,mxRadialTreeLayout,' +
              'mxImageExport,mxXmlCanvas2D,mxXmlRequest,mxHierarchicalLayout,mxMorphing',
          ],
        },
      },

      // We bundle these raw files and so we don't have to download separately at runtime
      {
        test: /(default\.xml|grapheditor.txt)$/,
        loader: 'raw-loader',
      },
    ],
  },
  plugins: [
    // cleanup dist dir
    new CleanWebpackPlugin(),

    // Process.env injections
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),

    new CaseSensitivePathsPlugin(),

    // Copy the resources that applications will need into a public dir in our package
    // Some are from mxGraph which expects to download files at runtime. Others are
    // from GraphEditor (e.g. clipart images or stencils) and needn't be packaged
    // with the main bundle.
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
};

// eslint-disable-next-line no-process-env
if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    // Strip out comments. Stripping puts them into a separate file
    new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
    }),

    // Bundle report
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.join(TEMP_PATH, 'reports/webpack-report.html'),
      openAnalyzer: false,
    }),
  );
}
