module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  lintOnSave: true,
  // chainWebpack: (config) => {
  //   config.module
  //     .rule('exports')
  //     .test(/mxClient\.js$/)
  //     .use('exports-loader')
  //     .loader(
  //       'exports-loader?mxClient,mxToolbar,mxEdgeStyle,mxConnectionHandler,mxEllipse,mxConnectionConstraint,mxWindow,' +
  //         'mxObjectCodec,mxGraphModel,mxActor,mxPopupMenu,mxShape,mxEventObject,mxGraph,mxPopupMenuHandler,mxPrintPreview,' +
  //         'mxEventSource,mxRectangle,mxVertexHandler,mxMouseEvent,mxGraphView,mxCodecRegistry,mxImage,mxGeometry,mxCellState,' +
  //         'mxRubberband,mxConstraintHandler,mxKeyHandler,mxDragSource,mxGraphModel,mxEvent,mxUtils,mxEvent,mxCodec,mxCell,' +
  //         'mxConstants,mxPoint,mxGraphHandler,mxCylinder,mxCellRenderer,mxEvent,mxUndoManager,mxStencilRegistry,mxStencil,' +
  //         'mxText,mxSvgCanvas2D,mxCellHighlight,mxStackLayout,mxConnector,mxEdgeHandler,mxGuide,mxCellEditor,' +
  //         'mxSelectionCellsHandler,mxOutline,mxPanningHandler,mxResources,mxLayoutManager,mxRectangleShape,mxDictionary,' +
  //         'mxClipboard,mxGeometryChange,mxValueChange,mxPolyline,mxImageShape,mxElbowEdgeHandler,mxObjectIdentity,' +
  //         'mxStyleRegistry,mxGraphLayout,mxLine,mxHandle,mxSwimlane,mxCylinder,mxActor,mxRectangleShape,mxRhombus,mxLabel,' +
  //         'mxTriangle,mxHexagon,mxCloud,mxArrow,mxRectangleShape,mxPerimeter,mxDoubleEllipse,mxArrowConnector,' +
  //         'mxMarker,mxStylesheet',
  //     )
  //     .end();

  //   config.module
  //     .rule('raw-files')
  //     .test(/(default\.xml|grapheditor.txt)$/)
  //     .use('raw-loader')
  //     .loader('raw-loader')
  //     .end();
  // },
};
