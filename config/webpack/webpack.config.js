const path = require('path');
const webpack = require('webpack');

// const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

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
      // TODO: Remove if runtime works... From Toasted
      // vue$: 'vue/dist/vue.esm.js',
      vue$: 'vue/dist/vue.runtime.esm.js',
      // images: path.resolve(ROOT_PATH, 'src/assets/images'),
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
            scss: 'vue-style-loader!css-loader!postcss-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!postcss-loader!sass-loader?indentedSyntax',
          },
          // other vue-loader options go here
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
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
    // enable vue-loader to use existing loader rules for other module types
    new VueLoaderPlugin(),
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
  devServer: {
    hot: !IS_PRODUCTION && DEV_SERVER_LIVERELOAD,
    liveReload: !IS_PRODUCTION && DEV_SERVER_LIVERELOAD,
    open: 'Google Chrome',
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
    disableHostCheck: true,
    noInfo: false,
  },
  performance: {
    hints: false,
  },
  devtool,
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';

  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    // TODO: what's this do
    // new webpack.ProvidePlugin({}),
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
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]);
}
