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

// TEN9: Added imports
const {
  mxClient,
  mxClipboard,
  mxCodecRegistry,
  mxConnectionHandler,
  mxConstants,
  mxDictionary,
  mxEvent,
  mxEventObject,
  mxEventSource,
  mxGraphModel,
  mxImage,
  mxKeyHandler,
  mxMorphing,
  mxObjectCodec,
  mxObjectIdentity,
  mxOutline,
  mxPoint,
  mxPopupMenu,
  mxRectangle,
  mxResources,
  mxStackLayout,
  mxStylesheet,
  mxUtils,
  mxXmlRequest,
} = require('./mxClient.js');

const { Editor, Dialog, ErrorDialog, FilenameDialog } = require('./Editor.js');
const { Actions } = require('./Actions.js');
const { Sidebar } = require('./Sidebar.js');
require('./Shapes.js');
require('../diagramly/sidebar/Sidebar.js');
require('../diagramly/sidebar/Sidebar-Shapes.js');
const { Format } = require('./Format.js');
const { Menus } = require('./Menus.js');
const { Toolbar } = require('./Toolbar.js');
const { ColorDialog, EditDataDialog, LinkDialog, OpenDialog } = require('./Dialogs.js');
const { DiagramPage } = require('../diagramly/Diagram.js'); 
const graphUtils = require('./graph_utils.js');

const urlParams = {};

//TEN9: add more sheet
// const { tabsContainer,
//   pageChange,
//   pageRename,
//   pageMove,
//    } = require('../diagramly/Pages');

// TEN9: TODO: Centralize all globals
window.mxStylesheet = mxStylesheet;
const MAX_REQUEST_SIZE = 10485760;

function createEditorUi(editor, container) {
  return new EditorUi(editor, container);
}

/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new graph editor
 */
EditorUi = function (editor, container, lightbox) {
  mxEventSource.call(this);

  this.destroyFunctions = [];
  this.editor = editor || new Editor();
  this.container = container || document.body;
  mxClient.setDocumentContainer(this.container);

  var graph = this.editor.graph;
  graph.lightbox = lightbox;
  this.initialDefaultVertexStyle = mxUtils.clone(graph.defaultVertexStyle);
  this.initialDefaultEdgeStyle = mxUtils.clone(graph.defaultEdgeStyle);

  // Faster scrollwheel zoom is possible with CSS transforms
  if (graph.useCssTransforms) {
    this.lazyZoomDelay = 0;
  }

  // Pre-fetches submenu image or replaces with embedded image if supported
  if (mxClient.IS_SVG) {
    mxPopupMenu.prototype.submenuImage =
      'data:image/gif;base64,R0lGODlhCQAJAIAAAP///zMzMyH5BAEAAAAALAAAAAAJAAkAAAIPhI8WebHsHopSOVgb26AAADs=';
  } else {
    new Image().src = mxPopupMenu.prototype.submenuImage;
  }

  // Pre-fetches connect image
  if (!mxClient.IS_SVG && mxConnectionHandler.prototype.connectImage != null) {
    new Image().src = mxConnectionHandler.prototype.connectImage.src;
  }

  // Disables graph and forced panning in chromeless mode
  if (this.editor.chromeless && !this.editor.editable) {
    this.footerHeight = 0;
    graph.isEnabled = function () {
      return false;
    };
    graph.panningHandler.isForcePanningEvent = function (me) {
      return !mxEvent.isPopupTrigger(me.getEvent());
    };
  }

  // Creates the user interface
  // TEN9: Pass ChangePageSetup here to avoid import cycle issue
  this.actions = new Actions(this, ChangePageSetup);
  this.menus = this.createMenus();

  if (!graph.standalone) {
    this.createDivs();
    this.createUi();
    this.refresh();

    // Disables HTML and text selection
    var textEditing = mxUtils.bind(this, function (evt) {
      if (evt == null) {
        evt = window.event;
      }

      return graph.isEditing() || (evt != null && this.isSelectionAllowed(evt));
    });

    // Disables text selection while not editing and no dialog visible
    if (this.container == document.body) {
      this.menubarContainer.onselectstart = textEditing;
      this.menubarContainer.onmousedown = textEditing;
      this.toolbarContainer.onselectstart = textEditing;
      this.toolbarContainer.onmousedown = textEditing;
      this.diagramContainer.onselectstart = textEditing;
      this.diagramContainer.onmousedown = textEditing;
      this.sidebarContainer.onselectstart = textEditing;
      this.sidebarContainer.onmousedown = textEditing;
      this.formatContainer.onselectstart = textEditing;
      this.formatContainer.onmousedown = textEditing;
      this.footerContainer.onselectstart = textEditing;
      this.footerContainer.onmousedown = textEditing;

      if (this.tabContainer != null) {
        // Mouse down is needed for drag and drop
        this.tabContainer.onselectstart = textEditing;
      }
    }

    // And uses built-in context menu while editing
    if (!this.editor.chromeless || this.editor.editable) {
      // Allows context menu for links in hints
      var linkHandler = function (evt) {
        if (evt != null) {
          var source = mxEvent.getSource(evt);

          if (source.nodeName == 'A') {
            while (source != null) {
              if (source.className == 'geHint') {
                return true;
              }

              source = source.parentNode;
            }
          }
        }

        return textEditing(evt);
      };

      if (
        mxClient.IS_IE &&
        (typeof document.documentMode === 'undefined' || document.documentMode < 9)
      ) {
        mxEvent.addListener(this.diagramContainer, 'contextmenu', linkHandler);
      } else {
        // Allows browser context menu outside of diagram and sidebar
        this.diagramContainer.oncontextmenu = linkHandler;
      }
    } else {
      graph.panningHandler.usePopupTrigger = false;
    }

    // Contains the main graph instance inside the given panel
    graph.init(this.diagramContainer);

    // Improves line wrapping for in-place editor
    if (mxClient.IS_SVG && graph.view.getDrawPane() != null) {
      var root = graph.view.getDrawPane().ownerSVGElement;

      if (root != null) {
        root.style.position = 'absolute';
      }
    }

    // Creates hover icons
    this.hoverIcons = this.createHoverIcons();

    // Hides hover icons when cells are moved
    if (graph.graphHandler != null) {
      var graphHandlerStart = graph.graphHandler.start;

      graph.graphHandler.start = function () {
        if (ui.hoverIcons != null) {
          ui.hoverIcons.reset();
        }

        graphHandlerStart.apply(this, arguments);
      };
    }

    // Adds tooltip when mouse is over scrollbars to show space-drag panning option
    mxEvent.addListener(
      this.diagramContainer,
      'mousemove',
      mxUtils.bind(this, function (evt) {
        var off = mxUtils.getOffset(this.diagramContainer);

        if (
          mxEvent.getClientX(evt) - off.x - this.diagramContainer.clientWidth > 0 ||
          mxEvent.getClientY(evt) - off.y - this.diagramContainer.clientHeight > 0
        ) {
          this.diagramContainer.setAttribute('title', mxResources.get('panTooltip'));
        } else {
          this.diagramContainer.removeAttribute('title');
        }
      }),
    );

    // Escape key hides dialogs, adds space+drag panning
    var spaceKeyPressed = false;

    // Overrides hovericons to disable while space key is pressed
    var hoverIconsIsResetEvent = this.hoverIcons.isResetEvent;

    this.hoverIcons.isResetEvent = function (evt, allowShift) {
      return spaceKeyPressed || hoverIconsIsResetEvent.apply(this, arguments);
    };

    this.keydownHandler = mxUtils.bind(this, function (evt) {
      if (evt.which == 32 /* Space */ && !graph.isEditing()) {
        spaceKeyPressed = true;
        this.hoverIcons.reset();
        graph.container.style.cursor = 'move';

        // Disables scroll after space keystroke with scrollbars
        if (!graph.isEditing() && mxEvent.getSource(evt) == graph.container) {
          mxEvent.consume(evt);
        }
      } else if (!mxEvent.isConsumed(evt) && evt.keyCode == 27 /* Escape */) {
        this.hideDialog(null, true);
      }
    });

    mxEvent.addListener(document, 'keydown', this.keydownHandler);

    this.keyupHandler = mxUtils.bind(this, function (evt) {
      graph.container.style.cursor = '';
      spaceKeyPressed = false;
    });

    mxEvent.addListener(document, 'keyup', this.keyupHandler);

    // Forces panning for middle and right mouse buttons
    var panningHandlerIsForcePanningEvent = graph.panningHandler.isForcePanningEvent;
    graph.panningHandler.isForcePanningEvent = function (me) {
      // Ctrl+left button is reported as right button in FF on Mac
      return (
        panningHandlerIsForcePanningEvent.apply(this, arguments) ||
        spaceKeyPressed ||
        (mxEvent.isMouseEvent(me.getEvent()) &&
          (this.usePopupTrigger || !mxEvent.isPopupTrigger(me.getEvent())) &&
          ((!mxEvent.isControlDown(me.getEvent()) && mxEvent.isRightMouseButton(me.getEvent())) ||
            mxEvent.isMiddleMouseButton(me.getEvent())))
      );
    };

    // Ctrl/Cmd+Enter applies editing value except in Safari where Ctrl+Enter creates
    // a new line (while Enter creates a new paragraph and Shift+Enter stops)
    var cellEditorIsStopEditingEvent = graph.cellEditor.isStopEditingEvent;
    graph.cellEditor.isStopEditingEvent = function (evt) {
      return (
        cellEditorIsStopEditingEvent.apply(this, arguments) ||
        (evt.keyCode == 13 &&
          ((!mxClient.IS_SF && mxEvent.isControlDown(evt)) ||
            (mxClient.IS_MAC && mxEvent.isMetaDown(evt)) ||
            (mxClient.IS_SF && mxEvent.isShiftDown(evt))))
      );
    };

    // Adds space+wheel for zoom
    var graphIsZoomWheelEvent = graph.isZoomWheelEvent;

    graph.isZoomWheelEvent = function () {
      return spaceKeyPressed || graphIsZoomWheelEvent.apply(this, arguments);
    };

    // Switches toolbar for text editing
    var textMode = false;
    var fontMenu = null;
    var sizeMenu = null;
    var nodes = null;

    var updateToolbar = mxUtils.bind(this, function () {
      if (this.toolbar != null && textMode != graph.cellEditor.isContentEditing()) {
        var node = this.toolbar.container.firstChild;
        var newNodes = [];

        while (node != null) {
          var tmp = node.nextSibling;

          if (mxUtils.indexOf(this.toolbar.staticElements, node) < 0) {
            node.parentNode.removeChild(node);
            newNodes.push(node);
          }

          node = tmp;
        }

        // Saves references to special items
        var tmp1 = this.toolbar.fontMenu;
        var tmp2 = this.toolbar.sizeMenu;

        if (nodes == null) {
          this.toolbar.createTextToolbar();
        } else {
          for (var i = 0; i < nodes.length; i++) {
            this.toolbar.container.appendChild(nodes[i]);
          }

          // Restores references to special items
          this.toolbar.fontMenu = fontMenu;
          this.toolbar.sizeMenu = sizeMenu;
        }

        textMode = graph.cellEditor.isContentEditing();
        fontMenu = tmp1;
        sizeMenu = tmp2;
        nodes = newNodes;
      }
    });

    var ui = this;

    // Overrides cell editor to update toolbar
    var cellEditorStartEditing = graph.cellEditor.startEditing;
    graph.cellEditor.startEditing = function () {
      cellEditorStartEditing.apply(this, arguments);
      updateToolbar();

      if (graph.cellEditor.isContentEditing()) {
        var updating = false;

        var updateCssHandler = function () {
          if (!updating) {
            updating = true;

            window.setTimeout(function () {
              var node = graph.getSelectedEditingElement();

              if (node != null) {
                var css = mxUtils.getCurrentStyle(node);

                if (css != null && ui.toolbar != null) {
                  ui.toolbar.setFontName(Graph.stripQuotes(css.fontFamily));
                  ui.toolbar.setFontSize(parseInt(css.fontSize));
                }
              }

              updating = false;
            }, 0);
          }
        };

        mxEvent.addListener(graph.cellEditor.textarea, 'input', updateCssHandler);
        mxEvent.addListener(graph.cellEditor.textarea, 'touchend', updateCssHandler);
        mxEvent.addListener(graph.cellEditor.textarea, 'mouseup', updateCssHandler);
        mxEvent.addListener(graph.cellEditor.textarea, 'keyup', updateCssHandler);
        updateCssHandler();
      }
    };

    // Updates toolbar and handles possible errors
    var cellEditorStopEditing = graph.cellEditor.stopEditing;
    graph.cellEditor.stopEditing = function (cell, trigger) {
      try {
        cellEditorStopEditing.apply(this, arguments);
        updateToolbar();
      } catch (e) {
        ui.handleError(e);
      }
    };

    // Enables scrollbars and sets cursor style for the container
    graph.container.setAttribute('tabindex', '0');
    graph.container.style.cursor = 'default';

    // Workaround for page scroll if embedded via iframe
    if (window.self === window.top && graph.container.parentNode != null) {
      try {
        graph.container.focus();
      } catch (e) {
        // ignores error in old versions of IE
      }
    }

    // Keeps graph container focused on mouse down
    var graphFireMouseEvent = graph.fireMouseEvent;
    graph.fireMouseEvent = function (evtName, me, sender) {
      if (evtName == mxEvent.MOUSE_DOWN) {
        this.container.focus();
      }

      graphFireMouseEvent.apply(this, arguments);
    };

    // Configures automatic expand on mouseover
    graph.popupMenuHandler.autoExpand = true;

    // Installs context menu
    if (this.menus != null) {
      graph.popupMenuHandler.factoryMethod = mxUtils.bind(this, function (menu, cell, evt) {
        this.menus.createPopupMenu(menu, cell, evt);
      });
    }

    // Hides context menu
    mxEvent.addGestureListeners(
      document,
      mxUtils.bind(this, function (evt) {
        graph.popupMenuHandler.hideMenu();
      }),
    );

    // Create handler for key events
    // TEN9: FIXED for jgraph bug (editor --> this.editor)
    this.keyHandler = this.createKeyHandler(this.editor);

    // Getter for key handler
    this.getKeyHandler = function () {
      return keyHandler;
    };

    // Stores the current style and assigns it to new cells
    var styles = [
      'rounded',
      'shadow',
      'glass',
      'dashed',
      'dashPattern',
      'labelBackgroundColor',
      'comic',
      'sketch',
      'fillWeight',
      'hachureGap',
      'hachureAngle',
      'jiggle',
      'disableMultiStroke',
      'disableMultiStrokeFill',
      'fillStyle',
      'curveFitting',
      'simplification',
      'sketchStyle',
    ];
    var connectStyles = [
      'shape',
      'edgeStyle',
      'curved',
      'rounded',
      'elbow',
      'jumpStyle',
      'jumpSize',
      'comic',
      'sketch',
      'fillWeight',
      'hachureGap',
      'hachureAngle',
      'jiggle',
      'disableMultiStroke',
      'disableMultiStrokeFill',
      'fillStyle',
      'curveFitting',
      'simplification',
      'sketchStyle',
    ];

    // Note: Everything that is not in styles is ignored (styles is augmented below)
    this.setDefaultStyle = function (cell) {
      try {
        var state = graph.view.getState(cell);

        if (state != null) {
          // Ignores default styles
          var clone = cell.clone();
          clone.style = '';
          var defaultStyle = graph.getCellStyle(clone);
          var values = [];
          var keys = [];

          for (var key in state.style) {
            if (defaultStyle[key] != state.style[key]) {
              values.push(state.style[key]);
              keys.push(key);
            }
          }

          // Handles special case for value "none"
          var cellStyle = graph.getModel().getStyle(state.cell);
          var tokens = cellStyle != null ? cellStyle.split(';') : [];

          for (var i = 0; i < tokens.length; i++) {
            var tmp = tokens[i];
            var pos = tmp.indexOf('=');

            if (pos >= 0) {
              var key = tmp.substring(0, pos);
              var value = tmp.substring(pos + 1);

              if (defaultStyle[key] != null && value == 'none') {
                values.push(value);
                keys.push(key);
              }
            }
          }

          // Resets current style
          if (graph.getModel().isEdge(state.cell)) {
            graph.currentEdgeStyle = {};
          } else {
            graph.currentVertexStyle = {};
          }

          this.fireEvent(
            new mxEventObject('styleChanged', 'keys', keys, 'values', values, 'cells', [
              state.cell,
            ]),
          );
        }
      } catch (e) {
        this.handleError(e);
      }
    };

    this.clearDefaultStyle = function () {
      graph.currentEdgeStyle = mxUtils.clone(graph.defaultEdgeStyle);
      graph.currentVertexStyle = mxUtils.clone(graph.defaultVertexStyle);

      // Updates UI
      this.fireEvent(new mxEventObject('styleChanged', 'keys', [], 'values', [], 'cells', []));
    };

    // Keys that should be ignored if the cell has a value (known: new default for all cells is html=1 so
    // for the html key this effecticely only works for edges inserted via the connection handler)
    var valueStyles = ['fontFamily', 'fontSource', 'fontSize', 'fontColor'];

    // Keys that always update the current edge style regardless of selection
    var alwaysEdgeStyles = [
      'edgeStyle',
      'startArrow',
      'startFill',
      'startSize',
      'endArrow',
      'endFill',
      'endSize',
    ];

    // Keys that are ignored together (if one appears all are ignored)
    var keyGroups = [
      [
        'startArrow',
        'startFill',
        'startSize',
        'sourcePerimeterSpacing',
        'endArrow',
        'endFill',
        'endSize',
        'targetPerimeterSpacing',
      ],
      ['strokeColor', 'strokeWidth'],
      ['fillColor', 'gradientColor'],
      valueStyles,
      ['opacity'],
      ['align'],
      ['html'],
    ];

    // Adds all keys used above to the styles array
    for (var i = 0; i < keyGroups.length; i++) {
      for (var j = 0; j < keyGroups[i].length; j++) {
        styles.push(keyGroups[i][j]);
      }
    }

    for (var i = 0; i < connectStyles.length; i++) {
      if (mxUtils.indexOf(styles, connectStyles[i]) < 0) {
        styles.push(connectStyles[i]);
      }
    }

    // Implements a global current style for edges and vertices that is applied to new cells
    var insertHandler = function (cells, asText, model) {
      model = model != null ? model : graph.getModel();

      model.beginUpdate();
      try {
        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];

          var appliedStyles;

          if (asText) {
            // Applies only basic text styles
            appliedStyles = ['fontSize', 'fontFamily', 'fontColor'];
          } else {
            // Removes styles defined in the cell style from the styles to be applied
            var cellStyle = model.getStyle(cell);
            var tokens = cellStyle != null ? cellStyle.split(';') : [];
            appliedStyles = styles.slice();

            for (var j = 0; j < tokens.length; j++) {
              var tmp = tokens[j];
              var pos = tmp.indexOf('=');

              if (pos >= 0) {
                var key = tmp.substring(0, pos);
                var index = mxUtils.indexOf(appliedStyles, key);

                if (index >= 0) {
                  appliedStyles.splice(index, 1);
                }

                // Handles special cases where one defined style ignores other styles
                for (var k = 0; k < keyGroups.length; k++) {
                  var group = keyGroups[k];

                  if (mxUtils.indexOf(group, key) >= 0) {
                    for (var l = 0; l < group.length; l++) {
                      var index2 = mxUtils.indexOf(appliedStyles, group[l]);

                      if (index2 >= 0) {
                        appliedStyles.splice(index2, 1);
                      }
                    }
                  }
                }
              }
            }
          }

          // Applies the current style to the cell
          var edge = model.isEdge(cell);
          var current = edge ? graph.currentEdgeStyle : graph.currentVertexStyle;
          var newStyle = model.getStyle(cell);

          for (var j = 0; j < appliedStyles.length; j++) {
            var key = appliedStyles[j];
            var styleValue = current[key];

            if (styleValue != null && (key != 'shape' || edge)) {
              // Special case: Connect styles are not applied here but in the connection handler
              if (!edge || mxUtils.indexOf(connectStyles, key) < 0) {
                newStyle = mxUtils.setStyle(newStyle, key, styleValue);
              }
            }
          }

          model.setStyle(cell, newStyle);
        }
      } finally {
        model.endUpdate();
      }
    };

    graph.addListener('cellsInserted', function (sender, evt) {
      insertHandler(evt.getProperty('cells'));
    });

    graph.addListener('textInserted', function (sender, evt) {
      insertHandler(evt.getProperty('cells'), true);
    });

    this.insertHandler = insertHandler;

    graph.connectionHandler.addListener(mxEvent.CONNECT, function (sender, evt) {
      var cells = [evt.getProperty('cell')];

      if (evt.getProperty('terminalInserted')) {
        cells.push(evt.getProperty('terminal'));
      }

      insertHandler(cells);
    });

    this.addListener(
      'styleChanged',
      mxUtils.bind(this, function (sender, evt) {
        // Checks if edges and/or vertices were modified
        var cells = evt.getProperty('cells');
        var vertex = false;
        var edge = false;

        if (cells.length > 0) {
          for (var i = 0; i < cells.length; i++) {
            vertex = graph.getModel().isVertex(cells[i]) || vertex;
            edge = graph.getModel().isEdge(cells[i]) || edge;

            if (edge && vertex) {
              break;
            }
          }
        } else {
          vertex = true;
          edge = true;
        }

        var keys = evt.getProperty('keys');
        var values = evt.getProperty('values');

        for (var i = 0; i < keys.length; i++) {
          var common = mxUtils.indexOf(valueStyles, keys[i]) >= 0;

          // Ignores transparent stroke colors
          if (keys[i] != 'strokeColor' || (values[i] != null && values[i] != 'none')) {
            // Special case: Edge style and shape
            if (mxUtils.indexOf(connectStyles, keys[i]) >= 0) {
              if (edge || mxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0) {
                if (values[i] == null) {
                  delete graph.currentEdgeStyle[keys[i]];
                } else {
                  graph.currentEdgeStyle[keys[i]] = values[i];
                }
              }
              // Uses style for vertex if defined in styles
              else if (vertex && mxUtils.indexOf(styles, keys[i]) >= 0) {
                if (values[i] == null) {
                  delete graph.currentVertexStyle[keys[i]];
                } else {
                  graph.currentVertexStyle[keys[i]] = values[i];
                }
              }
            } else if (mxUtils.indexOf(styles, keys[i]) >= 0) {
              if (vertex || common) {
                if (values[i] == null) {
                  delete graph.currentVertexStyle[keys[i]];
                } else {
                  graph.currentVertexStyle[keys[i]] = values[i];
                }
              }

              if (edge || common || mxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0) {
                if (values[i] == null) {
                  delete graph.currentEdgeStyle[keys[i]];
                } else {
                  graph.currentEdgeStyle[keys[i]] = values[i];
                }
              }
            }
          }
        }

        if (this.toolbar != null) {
          this.toolbar.setFontName(
            graph.currentVertexStyle['fontFamily'] || Menus.prototype.defaultFont,
          );
          this.toolbar.setFontSize(
            graph.currentVertexStyle['fontSize'] || Menus.prototype.defaultFontSize,
          );

          if (this.toolbar.edgeStyleMenu != null) {
            // Updates toolbar icon for edge style
            var edgeStyleDiv = this.toolbar.edgeStyleMenu.getElementsByTagName('div')[0];

            if (
              graph.currentEdgeStyle['edgeStyle'] == 'orthogonalEdgeStyle' &&
              graph.currentEdgeStyle['curved'] == '1'
            ) {
              edgeStyleDiv.className = 'geSprite geSprite-curved';
            } else if (
              graph.currentEdgeStyle['edgeStyle'] == 'straight' ||
              graph.currentEdgeStyle['edgeStyle'] == 'none' ||
              graph.currentEdgeStyle['edgeStyle'] == null
            ) {
              edgeStyleDiv.className = 'geSprite geSprite-straight';
            } else if (graph.currentEdgeStyle['edgeStyle'] == 'entityRelationEdgeStyle') {
              edgeStyleDiv.className = 'geSprite geSprite-entity';
            } else if (graph.currentEdgeStyle['edgeStyle'] == 'elbowEdgeStyle') {
              edgeStyleDiv.className =
                'geSprite geSprite-' +
                (graph.currentEdgeStyle['elbow'] == 'vertical'
                  ? 'verticalelbow'
                  : 'horizontalelbow');
            } else if (graph.currentEdgeStyle['edgeStyle'] == 'isometricEdgeStyle') {
              edgeStyleDiv.className =
                'geSprite geSprite-' +
                (graph.currentEdgeStyle['elbow'] == 'vertical'
                  ? 'verticalisometric'
                  : 'horizontalisometric');
            } else {
              edgeStyleDiv.className = 'geSprite geSprite-orthogonal';
            }
          }

          if (this.toolbar.edgeShapeMenu != null) {
            // Updates icon for edge shape
            var edgeShapeDiv = this.toolbar.edgeShapeMenu.getElementsByTagName('div')[0];

            if (graph.currentEdgeStyle['shape'] == 'link') {
              edgeShapeDiv.className = 'geSprite geSprite-linkedge';
            } else if (graph.currentEdgeStyle['shape'] == 'flexArrow') {
              edgeShapeDiv.className = 'geSprite geSprite-arrow';
            } else if (graph.currentEdgeStyle['shape'] == 'arrow') {
              edgeShapeDiv.className = 'geSprite geSprite-simplearrow';
            } else {
              edgeShapeDiv.className = 'geSprite geSprite-connection';
            }
          }

          // Updates icon for optinal line start shape
          if (this.toolbar.lineStartMenu != null) {
            var lineStartDiv = this.toolbar.lineStartMenu.getElementsByTagName('div')[0];

            lineStartDiv.className = this.getCssClassForMarker(
              'start',
              graph.currentEdgeStyle['shape'],
              graph.currentEdgeStyle[mxConstants.STYLE_STARTARROW],
              mxUtils.getValue(graph.currentEdgeStyle, 'startFill', '1'),
            );
          }

          // Updates icon for optinal line end shape
          if (this.toolbar.lineEndMenu != null) {
            var lineEndDiv = this.toolbar.lineEndMenu.getElementsByTagName('div')[0];

            lineEndDiv.className = this.getCssClassForMarker(
              'end',
              graph.currentEdgeStyle['shape'],
              graph.currentEdgeStyle[mxConstants.STYLE_ENDARROW],
              mxUtils.getValue(graph.currentEdgeStyle, 'endFill', '1'),
            );
          }
        }
      }),
    );

    // Update font size and font family labels
    if (this.toolbar != null) {
      var update = mxUtils.bind(this, function () {
        var ff = graph.currentVertexStyle['fontFamily'] || 'Helvetica';
        var fs = String(graph.currentVertexStyle['fontSize'] || '12');
        var state = graph.getView().getState(graph.getSelectionCell());

        if (state != null) {
          ff = state.style[mxConstants.STYLE_FONTFAMILY] || ff;
          fs = state.style[mxConstants.STYLE_FONTSIZE] || fs;

          if (ff.length > 10) {
            ff = ff.substring(0, 8) + '...';
          }
        }

        this.toolbar.setFontName(ff);
        this.toolbar.setFontSize(fs);
      });

      graph.getSelectionModel().addListener(mxEvent.CHANGE, update);
      graph.getModel().addListener(mxEvent.CHANGE, update);
    }

    // Makes sure the current layer is visible when cells are added
    graph.addListener(mxEvent.CELLS_ADDED, function (sender, evt) {
      var cells = evt.getProperty('cells');
      var parent = evt.getProperty('parent');

      if (
        graph.getModel().isLayer(parent) &&
        !graph.isCellVisible(parent) &&
        cells != null &&
        cells.length > 0
      ) {
        graph.getModel().setVisible(parent, true);
      }
    });

    // Global handler to hide the current menu
    this.gestureHandler = mxUtils.bind(this, function (evt) {
      if (this.currentMenu != null && mxEvent.getSource(evt) != this.currentMenu.div) {
        this.hideCurrentMenu();
      }
    });

    mxEvent.addGestureListeners(document, this.gestureHandler);

    // Updates the editor UI after the window has been resized or the orientation changes
    // Timeout is workaround for old IE versions which have a delay for DOM client sizes.
    // Should not use delay > 0 to avoid handle multiple repaints during window resize
    this.resizeHandler = mxUtils.bind(this, function () {
      window.setTimeout(
        mxUtils.bind(this, function () {
          if (this.editor.graph != null) {
            this.refresh();
          }
        }),
        0,
      );
    });

    mxEvent.addListener(window, 'resize', this.resizeHandler);

    this.orientationChangeHandler = mxUtils.bind(this, function () {
      this.refresh();
    });

    mxEvent.addListener(window, 'orientationchange', this.orientationChangeHandler);

    // Workaround for bug on iOS see
    // http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue
    if (mxClient.IS_IOS && !window.navigator.standalone) {
      this.scrollHandler = mxUtils.bind(this, function () {
        window.scrollTo(0, 0);
      });

      mxEvent.addListener(window, 'scroll', this.scrollHandler);
    }

    /**
     * Sets the initial scrollbar locations after a file was loaded.
     */
    this.editor.addListener(
      'resetGraphView',
      mxUtils.bind(this, function () {
        this.resetScrollbars();
      }),
    );

    /**
     * Repaints the grid.
     */
    this.addListener(
      'gridEnabledChanged',
      mxUtils.bind(this, function () {
        graph.view.validateBackground();
      }),
    );

    this.addListener(
      'backgroundColorChanged',
      mxUtils.bind(this, function () {
        graph.view.validateBackground();
      }),
    );

    /**
     * Repaints the grid.
     */
    graph.addListener(
      'gridSizeChanged',
      mxUtils.bind(this, function () {
        if (graph.isGridEnabled()) {
          graph.view.validateBackground();
        }
      }),
    );

    // Resets UI, updates action and menu states
    this.editor.resetGraph();
  }

  this.init();
 
  if (!graph.standalone) {
    this.open();
  }
};

// Extends mxEventSource
mxUtils.extend(EditorUi, mxEventSource);

/**
 * Global config that specifies if the compact UI elements should be used.
 */
EditorUi.compactUi = true;

/**
 * Specifies the size of the split bar.
 */
EditorUi.prototype.splitSize = mxClient.IS_TOUCH || mxClient.IS_POINTER ? 12 : 8;

/**
 * Specifies the height of the menubar. Default is 30.
 */
EditorUi.prototype.menubarHeight = 30;

/**
 * Specifies the width of the format panel should be enabled. Default is true.
 */
EditorUi.prototype.formatEnabled = true;

/**
 * Specifies the width of the format panel. Default is 240.
 */
EditorUi.prototype.formatWidth = 240;

/**
 * Specifies the height of the toolbar. Default is 38.
 */
EditorUi.prototype.toolbarHeight = 38;

/**
 * Specifies the height of the footer. Default is 28.
 */
// TEN9: Disabling footer for now by setting height to 0
// EditorUi.prototype.footerHeight = 28;
EditorUi.prototype.footerHeight = 0;

/**
 * Specifies the height of the optional sidebarFooterContainer. Default is 34.
 */
// TEN9: Set to 38 like draw.io
EditorUi.prototype.sidebarFooterHeight = 38;

/**
 * Specifies the position of the horizontal split bar. Default is 240 or 118 for
 * screen widths <= 640px.
 */
EditorUi.prototype.hsplitPosition =
  screen.width <= 640 ? 118 : urlParams['sidebar-entries'] != 'large' ? 212 : 240;

/**
 * Specifies if animations are allowed in <executeLayout>. Default is true.
 */
EditorUi.prototype.allowAnimation = true;

/**
 * Default is 2.
 */
EditorUi.prototype.lightboxMaxFitScale = 2;

/**
 * Default is 4.
 */
EditorUi.prototype.lightboxVerticalDivider = 4;

/**
 * Specifies if single click on horizontal split should collapse sidebar. Default is false.
 */
EditorUi.prototype.hsplitClickEnabled = false;

// TEN9: Add Preview Mode to check the diagram position
EditorUi.prototype.enabled = true;

EditorUi.prototype.closeOpenWindows = function () {
  if (this.actions.layersWindow?.window.isVisible()) {
    this.actions.layersWindow.window.setVisible(false);
  }

  if (this.actions.outlineWindow?.window.isVisible()) {
    this.actions.outlineWindow.window.setVisible(false);
  }
};

EditorUi.prototype.fitToWindow = function () {
  // TODO: use fitWindow instead of resetView when debugged and working

  // const actionName = 'fitWindow';
  const actionName = 'resetView';
  const action = this.actions.get(actionName);
  action.funct();
};

// TEN9: Add enable/disable function
EditorUi.prototype.setEnabled = function (enabled) {
  this.enabled = enabled;
  // Set the graph enabled state before anything else
  this.editor.graph.setEnabled(enabled);
  this.toggleSidebarPanel(enabled);
  this.toggleFormatPanel(enabled);

  this.editor.graph.popupMenuHandler.hideMenu();
  this.editor.graph.tooltipHandler.hideTooltip();

  if (!enabled) {
    this.closeOpenWindows();
  }
  this.toolbar.setEnabled(enabled);

  const undo = this.actions.get('undo');
  undo.setEnabled(enabled);

  const redo = this.actions.get('redo');
  redo.setEnabled(enabled);
};

/**
 * Installs the listeners to update the action states.
 */
EditorUi.prototype.init = function () {
  var graph = this.editor.graph;

  if (!graph.standalone) {
    if (urlParams['shape-picker'] != '0') {
      this.installShapePicker();
    }

    // Hides tooltips and connection points when scrolling
    mxEvent.addListener(
      graph.container,
      'scroll',
      mxUtils.bind(this, function () {
        graph.tooltipHandler.hide();

        if (graph.connectionHandler != null && graph.connectionHandler.constraintHandler != null) {
          graph.connectionHandler.constraintHandler.reset();
        }
      }),
    );

    // Hides tooltip on escape
    graph.addListener(
      mxEvent.ESCAPE,
      mxUtils.bind(this, function () {
        graph.tooltipHandler.hide();
        var rb = graph.getRubberband();

        if (rb != null) {
          rb.cancel();
        }
      }),
    );

    mxEvent.addListener(
      graph.container,
      'keydown',
      mxUtils.bind(this, function (evt) {
        this.onKeyDown(evt);
      }),
    );

    mxEvent.addListener(
      graph.container,
      'keypress',
      mxUtils.bind(this, function (evt) {
        this.onKeyPress(evt);
      }),
    );

    // Updates action states
    this.addUndoListener();
    // TEN9: Our autosave will make this moot. Disabling
    // this.addBeforeUnloadListener();

    graph.getSelectionModel().addListener(
      mxEvent.CHANGE,
      mxUtils.bind(this, function () {
        this.updateActionStates();
      }),
    );

    graph.getModel().addListener(
      mxEvent.CHANGE,
      mxUtils.bind(this, function () {
        this.updateActionStates();
      }),
    );

    // Changes action states after change of default parent
    var graphSetDefaultParent = graph.setDefaultParent;
    var ui = this;

    this.editor.graph.setDefaultParent = function () {
      graphSetDefaultParent.apply(this, arguments);
      ui.updateActionStates();
    };

    // Hack to make editLink available in vertex handler
    graph.editLink = ui.actions.get('editLink').funct;

    this.updateActionStates();
    this.initClipboard();
    this.initCanvas();

    this.editor.graph.model.clear();
    if (this.format != null) {
      this.format.init();
    }
  }

  this.textInputForNativeClipboard = this.installNativeClipboardHandler();
};

/**
 * Returns true if the given event should start editing. This implementation returns true.
 */
EditorUi.prototype.installShapePicker = function () {
  var graph = this.editor.graph;
  var ui = this;

  // Uses this event to process mouseDown to check the selection state before it is changed
  graph.addListener(
    mxEvent.FIRE_MOUSE_EVENT,
    mxUtils.bind(this, function (sender, evt) {
      if (evt.getProperty('eventName') == 'mouseDown') {
        ui.hideShapePicker();
      }
    }),
  );

  graph.addListener(
    mxEvent.ESCAPE,
    mxUtils.bind(this, function () {
      ui.hideShapePicker(true);
    }),
  );

  graph.getSelectionModel().addListener(
    mxEvent.CHANGE,
    mxUtils.bind(this, function () {
      ui.hideShapePicker(true);
    }),
  );

  graph.getModel().addListener(
    mxEvent.CHANGE,
    mxUtils.bind(this, function () {
      ui.hideShapePicker(true);
    }),
  );

  // Counts as popup menu
  var popupMenuHandlerIsMenuShowing = graph.popupMenuHandler.isMenuShowing;

  graph.popupMenuHandler.isMenuShowing = function () {
    return popupMenuHandlerIsMenuShowing.apply(this, arguments) || ui.shapePicker != null;
  };

  // Adds dbl click dialog for inserting shapes
  var graphDblClick = graph.dblClick;

  graph.dblClick = function (evt, cell) {
    if (this.isEnabled()) {
      if (cell == null && ui.sidebar != null && !mxEvent.isShiftDown(evt)) {
        mxEvent.consume(evt);
        var pt = mxUtils.convertPoint(
          this.container,
          mxEvent.getClientX(evt),
          mxEvent.getClientY(evt),
        );

        // Asynchronous to avoid direct insert after double tap
        window.setTimeout(
          mxUtils.bind(this, function () {
            ui.showShapePicker(pt.x, pt.y);
          }),
          30,
        );
      } else {
        graphDblClick.apply(this, arguments);
      }
    }
  };

  if (this.hoverIcons != null) {
    var hoverIconsDrag = this.hoverIcons.drag;

    this.hoverIcons.drag = function () {
      ui.hideShapePicker();
      hoverIconsDrag.apply(this, arguments);
    };

    var hoverIconsExecute = this.hoverIcons.execute;

    this.hoverIcons.execute = function (state, dir, me) {
      var evt = me.getEvent();

      if (!this.graph.isCloneEvent(evt) && !mxEvent.isShiftDown(evt)) {
        this.graph.connectVertex(
          state.cell,
          dir,
          this.graph.defaultEdgeLength,
          evt,
          null,
          null,
          mxUtils.bind(this, function (x, y, execute) {
            var temp = graph.getCompositeParent(state.cell);
            var geo = graph.getCellGeometry(temp);
            me.consume();

            while (temp != null && graph.model.isVertex(temp) && geo != null && geo.relative) {
              cell = temp;
              temp = graph.model.getParent(cell);
              geo = graph.getCellGeometry(temp);
            }

            // Asynchronous to avoid direct insert after double tap
            window.setTimeout(
              mxUtils.bind(this, function () {
                ui.showShapePicker(
                  me.getGraphX(),
                  me.getGraphY(),
                  temp,
                  mxUtils.bind(this, function (cell) {
                    execute(cell);
                  }),
                  dir,
                );
              }),
              30,
            );
          }),
          mxUtils.bind(this, function (result) {
            this.graph.selectCellsForConnectVertex(result, evt, this);
          }),
        );
      } else {
        hoverIconsExecute.apply(this, arguments);
      }
    };
  }
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.showShapePicker = function (x, y, source, callback, direction) {
  var cells = this.getCellsForShapePicker(source);

  if (cells != null && cells.length > 0) {
    var ui = this;
    var graph = this.editor.graph;
    var div = document.createElement('div');
    var sourceState = graph.view.getState(source);
    var style =
      source != null && (sourceState == null || !graph.isTransparentState(sourceState))
        ? graph.copyStyle(source)
        : null;

    // Do not place entry under pointer for touch devices
    div.className = 'geToolbarContainer geSidebarContainer geSidebar';
    div.style.cssText =
      'position:absolute;left:' +
      x +
      'px;top:' +
      y +
      'px;width:140px;border-radius:10px;padding:4px;text-align:center;' +
      'box-shadow:0px 0px 3px 1px #d1d1d1;padding: 6px 0 8px 0;';
    mxUtils.setPrefixedStyle(div.style, 'transform', 'translate(-22px,-22px)');

    if (graph.background != null && graph.background != mxConstants.NONE) {
      div.style.backgroundColor = graph.background;
    }

    graph.container.appendChild(div);

    var addCell = mxUtils.bind(this, function (cell) {
      // Wrapper needed to catch events
      var node = document.createElement('a');
      node.className = 'geItem';
      node.style.cssText =
        'position:relative;display:inline-block;position:relative;' +
        'width:30px;height:30px;cursor:pointer;overflow:hidden;padding:3px 0 0 3px;';
      div.appendChild(node);

      if (style != null) {
        this.sidebar.graph.pasteStyle(style, [cell]);
      } else {
        ui.insertHandler([cell], cell.value != '', this.sidebar.graph.model);
      }

      this.sidebar.createThumb(
        [cell],
        25,
        25,
        node,
        null,
        true,
        false,
        cell.geometry.width,
        cell.geometry.height,
      );

      mxEvent.addListener(node, 'click', function () {
        var clone = graph.cloneCell(cell);

        if (callback != null) {
          callback(clone);
        } else {
          clone.geometry.x = graph.snap(
            Math.round(x / graph.view.scale) - graph.view.translate.x - cell.geometry.width / 2,
          );
          clone.geometry.y = graph.snap(
            Math.round(y / graph.view.scale) - graph.view.translate.y - cell.geometry.height / 2,
          );

          graph.model.beginUpdate();
          try {
            graph.addCell(clone);
          } finally {
            graph.model.endUpdate();
          }

          graph.setSelectionCell(clone);
          graph.scrollCellToVisible(clone);
          graph.startEditingAtCell(clone);

          if (ui.hoverIcons != null) {
            ui.hoverIcons.update(graph.view.getState(clone));
          }
        }

        ui.hideShapePicker();
      });
    });

    for (var i = 0; i < cells.length; i++) {
      addCell(cells[i]);
    }

    if (ui.hoverIcons != null) {
      ui.hoverIcons.reset();
    }

    graph.popupMenuHandler.hideMenu();
    graph.tooltipHandler.hideTooltip();
    this.hideCurrentMenu();
    this.hideShapePicker();

    this.shapePickerCallback = callback;
    this.shapePicker = div;
  }
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.getCellsForShapePicker = function (cell) {
  var createVertex = mxUtils.bind(this, function (style, w, h, value) {
    return this.editor.graph.createVertex(
      null,
      null,
      value || '',
      0,
      0,
      w || 120,
      h || 60,
      style,
      false,
    );
  });

  return [
    cell != null
      ? this.editor.graph.cloneCell(cell)
      : createVertex(
          'text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;',
          40,
          20,
          'Text',
        ),
    createVertex('whiteSpace=wrap;html=1;'),
    createVertex('ellipse;whiteSpace=wrap;html=1;', 120, 80),
    createVertex('rhombus;whiteSpace=wrap;html=1;', 80, 80),
    createVertex(
      'shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;',
    ),
    createVertex(
      'shape=trapezoid;perimeter=trapezoidPerimeter;whiteSpace=wrap;html=1;fixedSize=1;',
      120,
      60,
    ),
    createVertex(
      'shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fixedSize=1;',
      120,
      80,
    ),
    createVertex('shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;', 120, 80),
    createVertex('shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;'),
    createVertex(
      'shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;darkOpacity=0.05;darkOpacity2=0.1;',
      120,
      80,
    ),
    createVertex(
      'shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;',
      80,
      100,
    ),
    createVertex('triangle;whiteSpace=wrap;html=1;', 60, 80),
    createVertex('shape=document;whiteSpace=wrap;html=1;boundedLbl=1;', 120, 80),
    createVertex('shape=tape;whiteSpace=wrap;html=1;', 120, 100),
    createVertex('ellipse;shape=cloud;whiteSpace=wrap;html=1;', 120, 80),
    createVertex('shape=cylinder;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;', 60, 80),
  ];
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.hideShapePicker = function (cancel) {
  if (this.shapePicker != null) {
    this.shapePicker.parentNode.removeChild(this.shapePicker);
    this.shapePicker = null;

    if (!cancel && this.shapePickerCallback != null) {
      this.shapePickerCallback();
    }

    this.shapePickerCallback = null;
  }
};

/**
 * Returns true if the given event should start editing. This implementation returns true.
 */
EditorUi.prototype.onKeyDown = function (evt) {
  var graph = this.editor.graph;

  // Tab selects next cell
  if (
    evt.which == 9 &&
    graph.isEnabled() &&
    !mxEvent.isAltDown(evt) &&
    (!graph.isEditing() || !mxEvent.isShiftDown(evt))
  ) {
    if (graph.isEditing()) {
      graph.stopEditing(false);
    } else {
      graph.selectCell(!mxEvent.isShiftDown(evt));
    }

    mxEvent.consume(evt);
  }
};

/**
 * Returns true if the given event should start editing. This implementation returns true.
 */
EditorUi.prototype.onKeyPress = function (evt) {
  var graph = this.editor.graph;

  // KNOWN: Focus does not work if label is empty in quirks mode
  if (
    this.isImmediateEditingEvent(evt) &&
    !graph.isEditing() &&
    !graph.isSelectionEmpty() &&
    evt.which !== 0 &&
    evt.which !== 27 &&
    !mxEvent.isAltDown(evt) &&
    !mxEvent.isControlDown(evt) &&
    !mxEvent.isMetaDown(evt)
  ) {
    graph.escape();
    graph.startEditing();

    // Workaround for FF where char is lost if cursor is placed before char
    if (mxClient.IS_FF) {
      var ce = graph.cellEditor;

      if (ce.textarea != null) {
        ce.textarea.innerHTML = String.fromCharCode(evt.which);

        // Moves cursor to end of textarea
        var range = document.createRange();
        range.selectNodeContents(ce.textarea);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }
};

/**
 * Returns true if the given event should start editing. This implementation returns true.
 */
EditorUi.prototype.isImmediateEditingEvent = function (evt) {
  return true;
};

/**
 * Private helper method.
 */
EditorUi.prototype.getCssClassForMarker = function (prefix, shape, marker, fill) {
  var result = '';

  if (shape == 'flexArrow') {
    result =
      marker != null && marker != mxConstants.NONE
        ? 'geSprite geSprite-' + prefix + 'blocktrans'
        : 'geSprite geSprite-noarrow';
  } else {
    // SVG marker sprites
    if (marker == 'box' || marker == 'halfCircle') {
      result = 'geSprite geSvgSprite geSprite-' + marker + (prefix == 'end' ? ' geFlipSprite' : '');
    } else if (marker == mxConstants.ARROW_CLASSIC) {
      result =
        fill == '1'
          ? 'geSprite geSprite-' + prefix + 'classic'
          : 'geSprite geSprite-' + prefix + 'classictrans';
    } else if (marker == mxConstants.ARROW_CLASSIC_THIN) {
      result =
        fill == '1'
          ? 'geSprite geSprite-' + prefix + 'classicthin'
          : 'geSprite geSprite-' + prefix + 'classicthintrans';
    } else if (marker == mxConstants.ARROW_OPEN) {
      result = 'geSprite geSprite-' + prefix + 'open';
    } else if (marker == mxConstants.ARROW_OPEN_THIN) {
      result = 'geSprite geSprite-' + prefix + 'openthin';
    } else if (marker == mxConstants.ARROW_BLOCK) {
      result =
        fill == '1'
          ? 'geSprite geSprite-' + prefix + 'block'
          : 'geSprite geSprite-' + prefix + 'blocktrans';
    } else if (marker == mxConstants.ARROW_BLOCK_THIN) {
      result =
        fill == '1'
          ? 'geSprite geSprite-' + prefix + 'blockthin'
          : 'geSprite geSprite-' + prefix + 'blockthintrans';
    } else if (marker == mxConstants.ARROW_OVAL) {
      result =
        fill == '1'
          ? 'geSprite geSprite-' + prefix + 'oval'
          : 'geSprite geSprite-' + prefix + 'ovaltrans';
    } else if (marker == mxConstants.ARROW_DIAMOND) {
      result =
        fill == '1'
          ? 'geSprite geSprite-' + prefix + 'diamond'
          : 'geSprite geSprite-' + prefix + 'diamondtrans';
    } else if (marker == mxConstants.ARROW_DIAMOND_THIN) {
      result =
        fill == '1'
          ? 'geSprite geSprite-' + prefix + 'thindiamond'
          : 'geSprite geSprite-' + prefix + 'thindiamondtrans';
    } else if (marker == 'openAsync') {
      result = 'geSprite geSprite-' + prefix + 'openasync';
    } else if (marker == 'dash') {
      result = 'geSprite geSprite-' + prefix + 'dash';
    } else if (marker == 'cross') {
      result = 'geSprite geSprite-' + prefix + 'cross';
    } else if (marker == 'async') {
      result =
        fill == '1'
          ? 'geSprite geSprite-' + prefix + 'async'
          : 'geSprite geSprite-' + prefix + 'asynctrans';
    } else if (marker == 'circle' || marker == 'circlePlus') {
      result =
        fill == '1' || marker == 'circle'
          ? 'geSprite geSprite-' + prefix + 'circle'
          : 'geSprite geSprite-' + prefix + 'circleplus';
    } else if (marker == 'ERone') {
      result = 'geSprite geSprite-' + prefix + 'erone';
    } else if (marker == 'ERmandOne') {
      result = 'geSprite geSprite-' + prefix + 'eronetoone';
    } else if (marker == 'ERmany') {
      result = 'geSprite geSprite-' + prefix + 'ermany';
    } else if (marker == 'ERoneToMany') {
      result = 'geSprite geSprite-' + prefix + 'eronetomany';
    } else if (marker == 'ERzeroToOne') {
      result = 'geSprite geSprite-' + prefix + 'eroneopt';
    } else if (marker == 'ERzeroToMany') {
      result = 'geSprite geSprite-' + prefix + 'ermanyopt';
    } else {
      result = 'geSprite geSprite-noarrow';
    }
  }

  return result;
};

/**
 * // TEN9: No longer...
 * Overriden in Menus.js
 */
EditorUi.prototype.createMenus = function () {
  // TEN9: Initializing the menu here to avoid any circular dependencies
  return new Menus(this);
  // return null;
};

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.updatePasteActionStates = function () {
  var graph = this.editor.graph;
  var paste = this.actions.get('paste');
  var pasteHere = this.actions.get('pasteHere');

  // TEN9: as we disable the paste of mxgraph we have make paste available for any action
  paste.setEnabled(true);
  pasteHere.setEnabled(true);

  // paste.setEnabled(
  //   this.editor.graph.cellEditor.isContentEditing() ||
  //     (!mxClipboard.isEmpty() &&
  //       graph.isEnabled() &&
  //       !graph.isCellLocked(graph.getDefaultParent())),
  // );
  // pasteHere.setEnabled(paste.isEnabled());
};

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.initClipboard = function () {
  var ui = this;

  var mxClipboardCut = mxClipboard.cut;
  mxClipboard.cut = function (graph) {
    if (graph.cellEditor.isContentEditing()) {
      document.execCommand('cut', false, null);
    } else {
      mxClipboardCut.apply(this, arguments);
    }

    ui.updatePasteActionStates();
  };

  var mxClipboardCopy = mxClipboard.copy;
  mxClipboard.copy = function (graph) {
    var result = null;

    if (graph.cellEditor.isContentEditing()) {
      document.execCommand('copy', false, null);
    } else {
      result = result || graph.getSelectionCells();
      result = graph.getExportableCells(graph.model.getTopmostCells(result));

      var cloneMap = new Object();
      var lookup = graph.createCellLookup(result);
      var clones = graph.cloneCells(result, null, cloneMap);

      // Uses temporary model to force new IDs to be assigned
      // to avoid having to carry over the mapping from object
      // ID to cell ID to the paste operation
      var model = new mxGraphModel();
      var parent = model.getChildAt(model.getRoot(), 0);

      for (var i = 0; i < clones.length; i++) {
        model.add(parent, clones[i]);

        // Checks for orphaned relative children and makes absolute
        var state = graph.view.getState(result[i]);

        if (state != null) {
          var geo = graph.getCellGeometry(clones[i]);

          if (
            geo != null &&
            geo.relative &&
            !model.isEdge(result[i]) &&
            lookup[mxObjectIdentity.get(model.getParent(result[i]))] == null
          ) {
            geo.offset = null;
            geo.relative = false;
            geo.x = state.x / state.view.scale - state.view.translate.x;
            geo.y = state.y / state.view.scale - state.view.translate.y;
          }
        }
      }

      graph.updateCustomLinks(graph.createCellMapping(cloneMap, lookup), clones);

      mxClipboard.insertCount = 1;
      mxClipboard.setCells(clones);
    }

    ui.updatePasteActionStates();

    return result;
  };

  var mxClipboardPaste = mxClipboard.paste;
  mxClipboard.paste = function (graph) {
    var result = null;

    if (graph.cellEditor.isContentEditing()) {
      document.execCommand('paste', false, null);
    } else {
      result = mxClipboardPaste.apply(this, arguments);
    }

    ui.updatePasteActionStates();

    return result;
  };

  // Overrides cell editor to update paste action state
  var cellEditorStartEditing = this.editor.graph.cellEditor.startEditing;

  this.editor.graph.cellEditor.startEditing = function () {
    cellEditorStartEditing.apply(this, arguments);
    ui.updatePasteActionStates();
  };

  var cellEditorStopEditing = this.editor.graph.cellEditor.stopEditing;

  this.editor.graph.cellEditor.stopEditing = function (cell, trigger) {
    cellEditorStopEditing.apply(this, arguments);
    ui.updatePasteActionStates();
  };

  this.updatePasteActionStates();
};

/**
 * Delay between zoom steps when not using preview.
 */
EditorUi.prototype.lazyZoomDelay = 20;

/**
 * Delay before update of DOM when using preview.
 */
EditorUi.prototype.wheelZoomDelay = 400;

/**
 * Delay before update of DOM when using preview.
 */
EditorUi.prototype.buttonZoomDelay = 600;

/**
 * Initializes the infinite canvas.
 */
EditorUi.prototype.initCanvas = function () {
  // Initial page layout view, scrollBuffer and timer-based scrolling
  var graph = this.editor.graph;
  graph.timerAutoScroll = true;

  /**
   * Returns the padding for pages in page view with scrollbars.
   */
  graph.getPagePadding = function () {
    return new mxPoint(
      Math.max(0, Math.round((graph.container.offsetWidth - 34) / graph.view.scale)),
      Math.max(0, Math.round((graph.container.offsetHeight - 34) / graph.view.scale)),
    );
  };

  // Fits the number of background pages to the graph
  graph.view.getBackgroundPageBounds = function () {
    var layout = this.graph.getPageLayout();
    var page = this.graph.getPageSize();

    return new mxRectangle(
      this.scale * (this.translate.x + layout.x * page.width),
      this.scale * (this.translate.y + layout.y * page.height),
      this.scale * layout.width * page.width,
      this.scale * layout.height * page.height,
    );
  };

  graph.getPreferredPageSize = function (bounds, width, height) {
    var pages = this.getPageLayout();
    var size = this.getPageSize();

    return new mxRectangle(0, 0, pages.width * size.width, pages.height * size.height);
  };

  // Scales pages/graph to fit available size
  var resize = null;
  var ui = this;

  if (this.editor.isChromelessView()) {
    resize = mxUtils.bind(this, function (autoscale, maxScale, cx, cy) {
      if (graph.container != null && !graph.isViewer()) {
        cx = cx != null ? cx : 0;
        cy = cy != null ? cy : 0;

        var bds = graph.pageVisible ? graph.view.getBackgroundPageBounds() : graph.getGraphBounds();
        var scroll = mxUtils.hasScrollbars(graph.container);
        var tr = graph.view.translate;
        var s = graph.view.scale;

        // Normalizes the bounds
        var b = mxRectangle.fromRectangle(bds);
        b.x = b.x / s - tr.x;
        b.y = b.y / s - tr.y;
        b.width /= s;
        b.height /= s;

        var st = graph.container.scrollTop;
        var sl = graph.container.scrollLeft;
        var sb = mxClient.IS_QUIRKS || document.documentMode >= 8 ? 20 : 14;

        if (document.documentMode == 8 || document.documentMode == 9) {
          sb += 3;
        }

        var cw = graph.container.offsetWidth - sb;
        var ch = graph.container.offsetHeight - sb;

        var ns = autoscale ? Math.max(0.3, Math.min(maxScale || 1, cw / b.width)) : s;
        var dx = (cw - ns * b.width) / 2 / ns;
        var dy =
          this.lightboxVerticalDivider == 0
            ? 0
            : (ch - ns * b.height) / this.lightboxVerticalDivider / ns;

        if (scroll) {
          dx = Math.max(dx, 0);
          dy = Math.max(dy, 0);
        }

        if (scroll || bds.width < cw || bds.height < ch) {
          graph.view.scaleAndTranslate(ns, Math.floor(dx - b.x), Math.floor(dy - b.y));
          graph.container.scrollTop = (st * ns) / s;
          graph.container.scrollLeft = (sl * ns) / s;
        } else if (cx != 0 || cy != 0) {
          var t = graph.view.translate;
          graph.view.setTranslate(Math.floor(t.x + cx / s), Math.floor(t.y + cy / s));
        }
      }
    });

    // Hack to make function available to subclassers
    this.chromelessResize = resize;

    // Hook for subclassers for override
    this.chromelessWindowResize = mxUtils.bind(this, function () {
      this.chromelessResize(false);
    });

    // Removable resize listener
    var autoscaleResize = mxUtils.bind(this, function () {
      this.chromelessWindowResize(false);
    });

    mxEvent.addListener(window, 'resize', autoscaleResize);

    this.destroyFunctions.push(function () {
      mxEvent.removeListener(window, 'resize', autoscaleResize);
    });

    this.editor.addListener(
      'resetGraphView',
      mxUtils.bind(this, function () {
        this.chromelessResize(true);
      }),
    );

    this.actions.get('zoomIn').funct = mxUtils.bind(this, function (evt) {
      graph.zoomIn();
      this.chromelessResize(false);
    });
    this.actions.get('zoomOut').funct = mxUtils.bind(this, function (evt) {
      graph.zoomOut();
      this.chromelessResize(false);
    });

    // Creates toolbar for viewer - do not use CSS here
    // as this may be used in a viewer that has no CSS
    if (urlParams['toolbar'] != '0') {
      var toolbarConfig = JSON.parse(decodeURIComponent(urlParams['toolbar-config'] || '{}'));

      this.chromelessToolbar = document.createElement('div');
      this.chromelessToolbar.style.position = 'fixed';
      this.chromelessToolbar.style.overflow = 'hidden';
      this.chromelessToolbar.style.boxSizing = 'border-box';
      this.chromelessToolbar.style.whiteSpace = 'nowrap';
      this.chromelessToolbar.style.backgroundColor = '#000000';
      this.chromelessToolbar.style.padding = '10px 10px 8px 10px';
      this.chromelessToolbar.style.left = graph.isViewer() ? '0' : '50%';

      if (!mxClient.IS_VML) {
        mxUtils.setPrefixedStyle(this.chromelessToolbar.style, 'borderRadius', '20px');
        mxUtils.setPrefixedStyle(
          this.chromelessToolbar.style,
          'transition',
          'opacity 600ms ease-in-out',
        );
      }

      var updateChromelessToolbarPosition = mxUtils.bind(this, function () {
        var css = mxUtils.getCurrentStyle(graph.container);

        if (graph.isViewer()) {
          this.chromelessToolbar.style.top = '0';
        } else {
          this.chromelessToolbar.style.bottom =
            (css != null ? parseInt(css['margin-bottom'] || 0) : 0) +
            (this.tabContainer != null ? 20 + parseInt(this.tabContainer.style.height) : 20) +
            'px';
        }
      });

      this.editor.addListener('resetGraphView', updateChromelessToolbarPosition);
      updateChromelessToolbarPosition();

      var btnCount = 0;

      var addButton = mxUtils.bind(this, function (fn, imgSrc, tip) {
        btnCount++;

        var a = document.createElement('span');
        a.style.paddingLeft = '8px';
        a.style.paddingRight = '8px';
        a.style.cursor = 'pointer';
        mxEvent.addListener(a, 'click', fn);

        if (tip != null) {
          a.setAttribute('title', tip);
        }

        var img = document.createElement('img');
        img.setAttribute('border', '0');
        img.setAttribute('src', imgSrc);

        a.appendChild(img);
        this.chromelessToolbar.appendChild(a);

        return a;
      });

      if (toolbarConfig.backBtn != null) {
        addButton(
          mxUtils.bind(this, function (evt) {
            window.location.href = toolbarConfig.backBtn.url;
            mxEvent.consume(evt);
          }),
          Editor.backLargeImage,
          mxResources.get('back', null, 'Back'),
        );
      }

      if (this.isPagesEnabled()) {
        var prevButton = addButton(
          mxUtils.bind(this, function (evt) {
            this.actions.get('previousPage').funct();
            mxEvent.consume(evt);
          }),
          Editor.previousLargeImage,
          mxResources.get('previousPage'),
        );

        var pageInfo = document.createElement('div');
        pageInfo.style.display = 'inline-block';
        pageInfo.style.verticalAlign = 'top';
        pageInfo.style.fontFamily = 'Helvetica,Arial';
        pageInfo.style.marginTop = '8px';
        pageInfo.style.fontSize = '14px';
        pageInfo.style.color = '#ffffff';
        this.chromelessToolbar.appendChild(pageInfo);

        var nextButton = addButton(
          mxUtils.bind(this, function (evt) {
            this.actions.get('nextPage').funct();
            mxEvent.consume(evt);
          }),
          Editor.nextLargeImage,
          mxResources.get('nextPage'),
        );

        var updatePageInfo = mxUtils.bind(this, function () {
          if (this.pages != null && this.pages.length > 1 && this.currentPage != null) {
            pageInfo.innerHTML = '';
            mxUtils.write(
              pageInfo,
              mxUtils.indexOf(this.pages, this.currentPage) + 1 + ' / ' + this.pages.length,
            );
          }
        });

        prevButton.style.paddingLeft = '0px';
        prevButton.style.paddingRight = '4px';
        nextButton.style.paddingLeft = '4px';
        nextButton.style.paddingRight = '0px';

        var updatePageButtons = mxUtils.bind(this, function () {
          if (this.pages != null && this.pages.length > 1 && this.currentPage != null) {
            nextButton.style.display = '';
            prevButton.style.display = '';
            pageInfo.style.display = 'inline-block';
          } else {
            nextButton.style.display = 'none';
            prevButton.style.display = 'none';
            pageInfo.style.display = 'none';
          }

          updatePageInfo();
        });

        this.editor.addListener('resetGraphView', updatePageButtons);
        this.editor.addListener('pageSelected', updatePageInfo);
      }

      addButton(
        mxUtils.bind(this, function (evt) {
          this.actions.get('zoomOut').funct();
          mxEvent.consume(evt);
        }),
        Editor.zoomOutLargeImage,
        mxResources.get('zoomOut') + ' (Alt+Mousewheel)',
      );

      addButton(
        mxUtils.bind(this, function (evt) {
          this.actions.get('zoomIn').funct();
          mxEvent.consume(evt);
        }),
        Editor.zoomInLargeImage,
        mxResources.get('zoomIn') + ' (Alt+Mousewheel)',
      );

      addButton(
        mxUtils.bind(this, function (evt) {
          if (graph.isLightboxView()) {
            if (graph.view.scale == 1) {
              this.lightboxFit();
            } else {
              graph.zoomTo(1);
            }

            this.chromelessResize(false);
          } else {
            this.chromelessResize(true);
          }

          mxEvent.consume(evt);
        }),
        Editor.actualSizeLargeImage,
        mxResources.get('fit'),
      );

      // Changes toolbar opacity on hover
      var fadeThread = null;
      var fadeThread2 = null;

      var fadeOut = mxUtils.bind(this, function (delay) {
        if (fadeThread != null) {
          window.clearTimeout(fadeThread);
          fadeThread = null;
        }

        if (fadeThread2 != null) {
          window.clearTimeout(fadeThread2);
          fadeThread2 = null;
        }

        fadeThread = window.setTimeout(
          mxUtils.bind(this, function () {
            mxUtils.setOpacity(this.chromelessToolbar, 0);
            fadeThread = null;

            fadeThread2 = window.setTimeout(
              mxUtils.bind(this, function () {
                this.chromelessToolbar.style.display = 'none';
                fadeThread2 = null;
              }),
              600,
            );
          }),
          delay || 200,
        );
      });

      var fadeIn = mxUtils.bind(this, function (opacity) {
        if (fadeThread != null) {
          window.clearTimeout(fadeThread);
          fadeThread = null;
        }

        if (fadeThread2 != null) {
          window.clearTimeout(fadeThread2);
          fadeThread2 = null;
        }

        this.chromelessToolbar.style.display = '';
        mxUtils.setOpacity(this.chromelessToolbar, opacity || 30);
      });

      if (urlParams['layers'] == '1') {
        this.layersDialog = null;

        var layersButton = addButton(
          mxUtils.bind(this, function (evt) {
            if (this.layersDialog != null) {
              this.layersDialog.parentNode.removeChild(this.layersDialog);
              this.layersDialog = null;
            } else {
              this.layersDialog = graph.createLayersDialog();

              mxEvent.addListener(
                this.layersDialog,
                'mouseleave',
                mxUtils.bind(this, function () {
                  this.layersDialog.parentNode.removeChild(this.layersDialog);
                  this.layersDialog = null;
                }),
              );

              var r = layersButton.getBoundingClientRect();

              mxUtils.setPrefixedStyle(this.layersDialog.style, 'borderRadius', '5px');
              this.layersDialog.style.position = 'fixed';
              this.layersDialog.style.fontFamily = 'Helvetica,Arial';
              this.layersDialog.style.backgroundColor = '#000000';
              this.layersDialog.style.width = '160px';
              this.layersDialog.style.padding = '4px 2px 4px 2px';
              this.layersDialog.style.color = '#ffffff';
              mxUtils.setOpacity(this.layersDialog, 70);
              this.layersDialog.style.left = r.left + 'px';
              this.layersDialog.style.bottom =
                parseInt(this.chromelessToolbar.style.bottom) +
                this.chromelessToolbar.offsetHeight +
                4 +
                'px';

              // Puts the dialog on top of the container z-index
              var style = mxUtils.getCurrentStyle(this.editor.graph.container);
              this.layersDialog.style.zIndex = style.zIndex;

              document.body.appendChild(this.layersDialog);
            }

            mxEvent.consume(evt);
          }),
          Editor.layersLargeImage,
          mxResources.get('layers'),
        );

        // Shows/hides layers button depending on content
        var model = graph.getModel();

        model.addListener(mxEvent.CHANGE, function () {
          layersButton.style.display = model.getChildCount(model.root) > 1 ? '' : 'none';
        });
      }

      this.addChromelessToolbarItems(addButton);

      if (this.editor.editButtonLink != null || this.editor.editButtonFunc != null) {
        addButton(
          mxUtils.bind(this, function (evt) {
            if (this.editor.editButtonFunc != null) {
              this.editor.editButtonFunc();
            } else if (this.editor.editButtonLink == '_blank') {
              this.editor.editAsNew(this.getEditBlankXml());
            } else {
              graph.openLink(this.editor.editButtonLink, 'editWindow');
            }

            mxEvent.consume(evt);
          }),
          Editor.editLargeImage,
          mxResources.get('edit'),
        );
      }

      if (this.lightboxToolbarActions != null) {
        for (var i = 0; i < this.lightboxToolbarActions.length; i++) {
          var lbAction = this.lightboxToolbarActions[i];
          addButton(lbAction.fn, lbAction.icon, lbAction.tooltip);
        }
      }

      if (toolbarConfig.refreshBtn != null) {
        addButton(
          mxUtils.bind(this, function (evt) {
            if (toolbarConfig.refreshBtn.url) {
              window.location.href = toolbarConfig.refreshBtn.url;
            } else {
              window.location.reload();
            }

            mxEvent.consume(evt);
          }),
          Editor.refreshLargeImage,
          mxResources.get('refresh', null, 'Refresh'),
        );
      }

      if (toolbarConfig.fullscreenBtn != null && window.self !== window.top) {
        addButton(
          mxUtils.bind(this, function (evt) {
            if (toolbarConfig.fullscreenBtn.url) {
              graph.openLink(toolbarConfig.fullscreenBtn.url);
            } else {
              graph.openLink(window.location.href);
            }

            mxEvent.consume(evt);
          }),
          Editor.fullscreenLargeImage,
          mxResources.get('openInNewWindow', null, 'Open in New Window'),
        );
      }

      if (
        (toolbarConfig.closeBtn && window.self === window.top) ||
        (graph.lightbox && (urlParams['close'] == '1' || this.container != document.body))
      ) {
        addButton(
          mxUtils.bind(this, function (evt) {
            if (urlParams['close'] == '1' || toolbarConfig.closeBtn) {
              window.close();
            } else {
              this.destroy();
              mxEvent.consume(evt);
            }
          }),
          Editor.closeLargeImage,
          mxResources.get('close') + ' (Escape)',
        );
      }

      // Initial state invisible
      this.chromelessToolbar.style.display = 'none';

      if (!graph.isViewer()) {
        mxUtils.setPrefixedStyle(this.chromelessToolbar.style, 'transform', 'translate(-50%,0)');
      }

      graph.container.appendChild(this.chromelessToolbar);

      mxEvent.addListener(
        graph.container,
        mxClient.IS_POINTER ? 'pointermove' : 'mousemove',
        mxUtils.bind(this, function (evt) {
          if (!mxEvent.isTouchEvent(evt)) {
            if (!mxEvent.isShiftDown(evt)) {
              fadeIn(30);
            }

            fadeOut();
          }
        }),
      );

      mxEvent.addListener(
        this.chromelessToolbar,
        mxClient.IS_POINTER ? 'pointermove' : 'mousemove',
        function (evt) {
          mxEvent.consume(evt);
        },
      );

      mxEvent.addListener(
        this.chromelessToolbar,
        'mouseenter',
        mxUtils.bind(this, function (evt) {
          if (!mxEvent.isShiftDown(evt)) {
            fadeIn(100);
          } else {
            fadeOut();
          }
        }),
      );

      mxEvent.addListener(
        this.chromelessToolbar,
        'mousemove',
        mxUtils.bind(this, function (evt) {
          if (!mxEvent.isShiftDown(evt)) {
            fadeIn(100);
          } else {
            fadeOut();
          }

          mxEvent.consume(evt);
        }),
      );

      mxEvent.addListener(
        this.chromelessToolbar,
        'mouseleave',
        mxUtils.bind(this, function (evt) {
          if (!mxEvent.isTouchEvent(evt)) {
            fadeIn(30);
          }
        }),
      );

      // Shows/hides toolbar for touch devices
      var tol = graph.getTolerance();

      graph.addMouseListener({
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        scrollTop: 0,
        mouseDown: function (sender, me) {
          this.startX = me.getGraphX();
          this.startY = me.getGraphY();
          this.scrollLeft = graph.container.scrollLeft;
          this.scrollTop = graph.container.scrollTop;
        },
        mouseMove: function (sender, me) {},
        mouseUp: function (sender, me) {
          if (mxEvent.isTouchEvent(me.getEvent())) {
            if (
              Math.abs(this.scrollLeft - graph.container.scrollLeft) < tol &&
              Math.abs(this.scrollTop - graph.container.scrollTop) < tol &&
              Math.abs(this.startX - me.getGraphX()) < tol &&
              Math.abs(this.startY - me.getGraphY()) < tol
            ) {
              if (parseFloat(ui.chromelessToolbar.style.opacity || 0) > 0) {
                fadeOut();
              } else {
                fadeIn(30);
              }
            }
          }
        },
      });
    } // end if toolbar

    // Installs handling of highlight and handling links to relative links and anchors
    if (!this.editor.editable) {
      this.addChromelessClickHandler();
    }
  } else if (this.editor.extendCanvas) {
    /**
     * Guesses autoTranslate to avoid another repaint (see below).
     * Works if only the scale of the graph changes or if pages
     * are visible and the visible pages do not change.
     */
    var graphViewValidate = graph.view.validate;
    graph.view.validate = function () {
      if (this.graph.container != null && mxUtils.hasScrollbars(this.graph.container)) {
        var pad = this.graph.getPagePadding();
        var size = this.graph.getPageSize();

        // Updating scrollbars here causes flickering in quirks and is not needed
        // if zoom method is always used to set the current scale on the graph.
        var tx = this.translate.x;
        var ty = this.translate.y;
        this.translate.x = pad.x - (this.x0 || 0) * size.width;
        this.translate.y = pad.y - (this.y0 || 0) * size.height;
      }

      graphViewValidate.apply(this, arguments);
    };

    if (!graph.isViewer()) {
      var graphSizeDidChange = graph.sizeDidChange;

      graph.sizeDidChange = function () {
        if (this.container != null && mxUtils.hasScrollbars(this.container)) {
          var pages = this.getPageLayout();
          var pad = this.getPagePadding();
          var size = this.getPageSize();

          // Updates the minimum graph size
          var minw = Math.ceil(2 * pad.x + pages.width * size.width);
          var minh = Math.ceil(2 * pad.y + pages.height * size.height);

          var min = graph.minimumGraphSize;

          // LATER: Fix flicker of scrollbar size in IE quirks mode
          // after delayed call in window.resize event handler
          if (min == null || min.width != minw || min.height != minh) {
            graph.minimumGraphSize = new mxRectangle(0, 0, minw, minh);
          }

          // Updates auto-translate to include padding and graph size
          var dx = pad.x - pages.x * size.width;
          var dy = pad.y - pages.y * size.height;

          if (!this.autoTranslate && (this.view.translate.x != dx || this.view.translate.y != dy)) {
            this.autoTranslate = true;
            this.view.x0 = pages.x;
            this.view.y0 = pages.y;

            // NOTE: THIS INVOKES THIS METHOD AGAIN. UNFORTUNATELY THERE IS NO WAY AROUND THIS SINCE THE
            // BOUNDS ARE KNOWN AFTER THE VALIDATION AND SETTING THE TRANSLATE TRIGGERS A REVALIDATION.
            // SHOULD MOVE TRANSLATE/SCALE TO VIEW.
            var tx = graph.view.translate.x;
            var ty = graph.view.translate.y;
            graph.view.setTranslate(dx, dy);

            // LATER: Fix rounding errors for small zoom
            graph.container.scrollLeft += Math.round((dx - tx) * graph.view.scale);
            graph.container.scrollTop += Math.round((dy - ty) * graph.view.scale);

            this.autoTranslate = false;

            return;
          }

          graphSizeDidChange.apply(this, arguments);
        } else {
          // Fires event but does not invoke superclass
          this.fireEvent(new mxEventObject(mxEvent.SIZE, 'bounds', this.getGraphBounds()));
        }
      };
    }
  }

  // Accumulates the zoom factor while the rendering is taking place
  // so that not the complete sequence of zoom steps must be painted
  var bgGroup = graph.view.getBackgroundPane();
  var mainGroup = graph.view.getDrawPane();
  graph.cumulativeZoomFactor = 1;
  var updateZoomTimeout = null;
  var cursorPosition = null;
  var scrollPosition = null;
  var forcedZoom = null;
  var filter = null;

  var scheduleZoom = function (delay) {
    if (updateZoomTimeout != null) {
      window.clearTimeout(updateZoomTimeout);
    }

    window.setTimeout(function () {
      if (!graph.isMouseDown || forcedZoom) {
        updateZoomTimeout = window.setTimeout(
          mxUtils.bind(this, function () {
            if (graph.isFastZoomEnabled()) {
              // Transforms background page
              if (
                graph.view.backgroundPageShape != null &&
                graph.view.backgroundPageShape.node != null
              ) {
                mxUtils.setPrefixedStyle(
                  graph.view.backgroundPageShape.node.style,
                  'transform-origin',
                  null,
                );
                mxUtils.setPrefixedStyle(
                  graph.view.backgroundPageShape.node.style,
                  'transform',
                  null,
                );
              }

              // Transforms graph and background image
              mainGroup.style.transformOrigin = '';
              bgGroup.style.transformOrigin = '';

              // Workaround for no reset of transform in Safari
              if (mxClient.IS_SF) {
                mainGroup.style.transform = 'scale(1)';
                bgGroup.style.transform = 'scale(1)';

                window.setTimeout(function () {
                  mainGroup.style.transform = '';
                  bgGroup.style.transform = '';
                }, 0);
              } else {
                mainGroup.style.transform = '';
                bgGroup.style.transform = '';
              }

              // Shows interactive elements
              graph.view.getDecoratorPane().style.opacity = '';
              graph.view.getOverlayPane().style.opacity = '';
            }

            var sp = new mxPoint(graph.container.scrollLeft, graph.container.scrollTop);
            // TEN9: Calculate offset from ui container instead of assuming body
            var offset = graphUtils.getOffset(ui.container, graph.container);
            var prev = graph.view.scale;
            var dx = 0;
            var dy = 0;

            if (cursorPosition != null) {
              dx = graph.container.offsetWidth / 2 - cursorPosition.x + offset.x;
              dy = graph.container.offsetHeight / 2 - cursorPosition.y + offset.y;
            }

            graph.zoom(graph.cumulativeZoomFactor);
            var s = graph.view.scale;

            if (s != prev) {
              if (scrollPosition != null) {
                dx += sp.x - scrollPosition.x;
                dy += sp.y - scrollPosition.y;
              }

              if (resize != null) {
                ui.chromelessResize(
                  false,
                  null,
                  dx * (graph.cumulativeZoomFactor - 1),
                  dy * (graph.cumulativeZoomFactor - 1),
                );
              }

              if (mxUtils.hasScrollbars(graph.container) && (dx != 0 || dy != 0)) {
                graph.container.scrollLeft -= dx * (graph.cumulativeZoomFactor - 1);
                graph.container.scrollTop -= dy * (graph.cumulativeZoomFactor - 1);
              }
            }

            if (filter != null) {
              mainGroup.setAttribute('filter', filter);
            }

            graph.cumulativeZoomFactor = 1;
            updateZoomTimeout = null;
            scrollPosition = null;
            cursorPosition = null;
            forcedZoom = null;
            filter = null;
          }),
          delay != null ? delay : graph.isFastZoomEnabled() ? ui.wheelZoomDelay : ui.lazyZoomDelay,
        );
      }
    }, 0);
  };

  graph.lazyZoom = function (zoomIn, ignoreCursorPosition, delay) {
    // TODO: Fix ignored cursor position if scrollbars are disabled
    ignoreCursorPosition = ignoreCursorPosition || !graph.scrollbars;

    if (ignoreCursorPosition) {
      cursorPosition = new mxPoint(
        graph.container.offsetLeft + graph.container.clientWidth / 2,
        graph.container.offsetTop + graph.container.clientHeight / 2,
      );
    }

    // Switches to 5% zoom steps below 15%
    if (zoomIn) {
      if (this.view.scale * this.cumulativeZoomFactor <= 0.15) {
        this.cumulativeZoomFactor *= (this.view.scale + 0.05) / this.view.scale;
      } else {
        // Uses to 5% zoom steps for better grid rendering in webkit
        // and to avoid rounding errors for zoom steps
        this.cumulativeZoomFactor *= this.zoomFactor;
        this.cumulativeZoomFactor =
          Math.round(this.view.scale * this.cumulativeZoomFactor * 20) / 20 / this.view.scale;
      }
    } else {
      if (this.view.scale * this.cumulativeZoomFactor <= 0.15) {
        this.cumulativeZoomFactor *= (this.view.scale - 0.05) / this.view.scale;
      } else {
        // Uses to 5% zoom steps for better grid rendering in webkit
        // and to avoid rounding errors for zoom steps
        this.cumulativeZoomFactor /= this.zoomFactor;
        this.cumulativeZoomFactor =
          Math.round(this.view.scale * this.cumulativeZoomFactor * 20) / 20 / this.view.scale;
      }
    }

    this.cumulativeZoomFactor =
      Math.max(0.05, Math.min(this.view.scale * this.cumulativeZoomFactor, 160)) / this.view.scale;

    if (graph.isFastZoomEnabled()) {
      if (filter == null && mainGroup.getAttribute('filter') != '') {
        filter = mainGroup.getAttribute('filter');
        mainGroup.removeAttribute('filter');
      }

      scrollPosition = new mxPoint(graph.container.scrollLeft, graph.container.scrollTop);

      var cx = ignoreCursorPosition
        ? graph.container.scrollLeft + graph.container.clientWidth / 2
        : cursorPosition.x + graph.container.scrollLeft - graph.container.offsetLeft;
      var cy = ignoreCursorPosition
        ? graph.container.scrollTop + graph.container.clientHeight / 2
        : cursorPosition.y + graph.container.scrollTop - graph.container.offsetTop;
      mainGroup.style.transformOrigin = cx + 'px ' + cy + 'px';
      mainGroup.style.transform = 'scale(' + this.cumulativeZoomFactor + ')';
      bgGroup.style.transformOrigin = cx + 'px ' + cy + 'px';
      bgGroup.style.transform = 'scale(' + this.cumulativeZoomFactor + ')';

      if (graph.view.backgroundPageShape != null && graph.view.backgroundPageShape.node != null) {
        var page = graph.view.backgroundPageShape.node;

        mxUtils.setPrefixedStyle(
          page.style,
          'transform-origin',
          (ignoreCursorPosition
            ? graph.container.clientWidth / 2 + graph.container.scrollLeft - page.offsetLeft + 'px'
            : cursorPosition.x +
              graph.container.scrollLeft -
              page.offsetLeft -
              graph.container.offsetLeft +
              'px') +
            ' ' +
            (ignoreCursorPosition
              ? graph.container.clientHeight / 2 + graph.container.scrollTop - page.offsetTop + 'px'
              : cursorPosition.y +
                graph.container.scrollTop -
                page.offsetTop -
                graph.container.offsetTop +
                'px'),
        );
        mxUtils.setPrefixedStyle(
          page.style,
          'transform',
          'scale(' + this.cumulativeZoomFactor + ')',
        );
      }

      graph.view.getDecoratorPane().style.opacity = '0';
      graph.view.getOverlayPane().style.opacity = '0';

      if (ui.hoverIcons != null) {
        ui.hoverIcons.reset();
      }
    }

    scheduleZoom(delay);
  };

  // Holds back repaint until after mouse gestures
  mxEvent.addGestureListeners(
    graph.container,
    function (evt) {
      if (updateZoomTimeout != null) {
        window.clearTimeout(updateZoomTimeout);
      }
    },
    null,
    function (evt) {
      if (graph.cumulativeZoomFactor != 1) {
        scheduleZoom(0);
      }
    },
  );

  // Holds back repaint until scroll ends
  mxEvent.addListener(graph.container, 'scroll', function (evt) {
    if (updateZoomTimeout != null && !graph.isMouseDown && graph.cumulativeZoomFactor != 1) {
      scheduleZoom(0);
    }
  });

  mxEvent.addMouseWheelListener(
    mxUtils.bind(this, function (evt, up, force, cx, cy) {
      if (this.dialogs == null || this.dialogs.length == 0) {
        // Scrolls with scrollbars turned off
        if (!graph.scrollbars && !force && graph.isScrollWheelEvent(evt)) {
          var t = graph.view.getTranslate();
          var step = 40 / graph.view.scale;

          if (!mxEvent.isShiftDown(evt)) {
            graph.view.setTranslate(t.x, t.y + (up ? step : -step));
          } else {
            graph.view.setTranslate(t.x + (up ? -step : step), t.y);
          }
        } else if (force || graph.isZoomWheelEvent(evt)) {
          var source = mxEvent.getSource(evt);

          while (source != null) {
            if (source == graph.container) {
              graph.tooltipHandler.hideTooltip();
              cursorPosition =
                cx != null && cy != null
                  ? new mxPoint(cx, cy)
                  : new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
              forcedZoom = force;
              graph.lazyZoom(up);
              mxEvent.consume(evt);

              return false;
            }

            source = source.parentNode;
          }
        }
      }
    }),
    graph.container,
  );

  // Uses fast zoom for pinch gestures on iOS
  graph.panningHandler.zoomGraph = function (evt) {
    graph.cumulativeZoomFactor = evt.scale;
    graph.lazyZoom(evt.scale > 0, true);
    mxEvent.consume(evt);
  };
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.addChromelessToolbarItems = function (addButton) {
  addButton(
    mxUtils.bind(this, function (evt) {
      this.actions.get('print').funct();
      mxEvent.consume(evt);
    }),
    Editor.printLargeImage,
    mxResources.get('print'),
  );
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.isPagesEnabled = function () {
  return this.editor.editable || urlParams['hide-pages'] != '1';
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.createTemporaryGraph = function (stylesheet) {
  var graph = new Graph(document.createElement('div'));
  graph.stylesheet.styles = mxUtils.clone(stylesheet.styles);
  graph.resetViewOnRootChange = false;
  graph.setConnectable(false);
  graph.gridEnabled = false;
  graph.autoScroll = false;
  graph.setTooltips(false);
  graph.setEnabled(false);

  // Container must be in the DOM for correct HTML rendering
  graph.container.style.visibility = 'hidden';
  graph.container.style.position = 'absolute';
  graph.container.style.overflow = 'hidden';
  graph.container.style.height = '1px';
  graph.container.style.width = '1px';

  return graph;
};

/**
 *
 */
EditorUi.prototype.addChromelessClickHandler = function () {
  var hl = urlParams['highlight'];

  // Adds leading # for highlight color code
  if (hl != null && hl.length > 0) {
    hl = '#' + hl;
  }

  this.editor.graph.addClickHandler(hl);
};

/**
 *
 */
EditorUi.prototype.toggleFormatPanel = function (visible) {
  visible = visible != null ? visible : this.formatWidth == 0;

  if (this.format != null) {
    this.formatWidth = visible ? 240 : 0;
    this.formatContainer.style.display = visible ? '' : 'none';
    this.refresh();
    this.format.refresh();
    this.fireEvent(new mxEventObject('formatWidthChanged'));
  }
};

// TEN9: Add sidebar toggle function
EditorUi.prototype.toggleSidebarPanel = function (visible) {
  if (!visible) {
    this.sidebar.container.style.width = '0px';
    this.sidebar.container.style.display = 'none';
    this.hsplit.style.display = 'none';
    this.diagramContainer.style.left = '0px';
  } else {
    this.sidebar.container.style.width = '212px';
    this.sidebar.container.style.display = 'block';
    this.hsplit.style.display = 'block';
    this.diagramContainer.style.left = '224px';
  }
};

/**
 * Adds support for placeholders in labels.
 */
EditorUi.prototype.lightboxFit = function (maxHeight) {
  if (this.isDiagramEmpty()) {
    this.editor.graph.view.setScale(1);
  } else {
    var p = urlParams['border'];
    var border = 60;

    if (p != null) {
      border = parseInt(p);
    }

    // LATER: Use initial graph bounds to avoid rounding errors
    this.editor.graph.maxFitScale = this.lightboxMaxFitScale;
    this.editor.graph.fit(border, null, null, null, null, null, maxHeight);
    this.editor.graph.maxFitScale = null;
  }
};

/**
 * Translates this point by the given vector.
 *
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
EditorUi.prototype.isDiagramEmpty = function () {
  var model = this.editor.graph.getModel();

  return (
    model.getChildCount(model.root) == 1 &&
    model.getChildCount(model.getChildAt(model.root, 0)) == 0
  );
};

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.isSelectionAllowed = function (evt) {
  return (
    mxEvent.getSource(evt).nodeName == 'SELECT' ||
    (mxEvent.getSource(evt).nodeName == 'INPUT' &&
      mxUtils.isAncestorNode(this.formatContainer, mxEvent.getSource(evt)))
  );
};

/**
 * Installs dialog if browser window is closed without saving
 * This must be disabled during save and image export.
 */
EditorUi.prototype.addBeforeUnloadListener = function () {
  // Installs dialog if browser window is closed without saving
  // This must be disabled during save and image export
  window.onbeforeunload = mxUtils.bind(this, function () {
    if (!this.editor.isChromelessView()) {
      return this.onBeforeUnload();
    }
  });
};

/**
 * Sets the onbeforeunload for the application
 */
EditorUi.prototype.onBeforeUnload = function () {
  if (this.editor.modified) {
    return mxResources.get('allChangesLost');
  }
};

/**
 * Opens the current diagram via the window.opener if one exists.
 */
EditorUi.prototype.open = function () {
  // Cross-domain window access is not allowed in FF, so if we
  // were opened from another domain then this will fail.
  try {
    if (window.opener != null && window.opener.openFile != null) {
      window.opener.openFile.setConsumer(
        mxUtils.bind(this, function (xml, filename) {
          try {
            var doc = mxUtils.parseXml(xml);
            this.editor.setGraphXml(doc.documentElement);
            this.editor.setModified(false);
            this.editor.undoManager.clear();

            if (filename != null) {
              this.editor.setFilename(filename);
              this.updateDocumentTitle();
            }

            return;
          } catch (e) {
            mxUtils.alert(mxResources.get('invalidOrMissingFile') + ': ' + e.message);
          }
        }),
      );
    }
  } catch (e) {
    // ignore
  }

  // Fires as the last step if no file was loaded
  this.editor.graph.view.validate();

  // Required only in special cases where an initial file is opened
  // and the minimumGraphSize changes and CSS must be updated.
  this.editor.graph.sizeDidChange();
  this.editor.fireEvent(new mxEventObject('resetGraphView'));
};

/**
 * Shows the given popup menu.
 */
EditorUi.prototype.showPopupMenu = function (fn, x, y, evt) {
  this.editor.graph.popupMenuHandler.hideMenu();

  var menu = new mxPopupMenu(fn);
  menu.div.className += ' geMenubarMenu';
  menu.smartSeparators = true;
  menu.showDisabled = true;
  menu.autoExpand = true;

  // Disables autoexpand and destroys menu when hidden
  menu.hideMenu = mxUtils.bind(this, function () {
    mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
    menu.destroy();
  });

  menu.popup(x, y, null, evt);

  // Allows hiding by clicking on document
  this.setCurrentMenu(menu);
};

/**
 * Sets the current menu and element.
 */
EditorUi.prototype.setCurrentMenu = function (menu, elt) {
  this.currentMenuElt = elt;
  this.currentMenu = menu;

  // TEN9: Replace this workaround with a better fix.
  // TEN9: add menu div into class geEditor so css will apply on the menu
  this.container.appendChild(menu.div);
};

/**
 * Resets the current menu and element.
 */
EditorUi.prototype.resetCurrentMenu = function () {
  this.currentMenuElt = null;
  this.currentMenu = null;
};

/**
 * Hides and destroys the current menu.
 */
EditorUi.prototype.hideCurrentMenu = function () {
  if (this.currentMenu != null) {
    this.currentMenu.hideMenu();
    this.resetCurrentMenu();
  }
};

/**
 * Updates the document title.
 */
EditorUi.prototype.updateDocumentTitle = function () {
  var title = this.editor.getOrCreateFilename();

  if (this.editor.appName != null) {
    title += ' - ' + this.editor.appName;
  }

  document.title = title;
};

/**
 * Updates the document title.
 */
EditorUi.prototype.createHoverIcons = function () {
  return new HoverIcons(this.editor.graph);
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.redo = function () {
  try {
    var graph = this.editor.graph;

    if (graph.isEditing()) {
      document.execCommand('redo', false, null);
    } else {
      this.editor.undoManager.redo();
    }
  } catch (e) {
    // ignore all errors
  }
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.undo = function () {
  try {
    var graph = this.editor.graph;

    if (graph.isEditing()) {
      // Stops editing and executes undo on graph if native undo
      // does not affect current editing value
      var value = graph.cellEditor.textarea.innerHTML;
      document.execCommand('undo', false, null);

      if (value == graph.cellEditor.textarea.innerHTML) {
        graph.stopEditing(true);
        this.editor.undoManager.undo();
      }
    } else {
      this.editor.undoManager.undo();
    }
  } catch (e) {
    // ignore all errors
  }
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.canRedo = function () {
  return this.editor.graph.isEditing() || this.editor.undoManager.canRedo();
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.canUndo = function () {
  return this.editor.graph.isEditing() || this.editor.undoManager.canUndo();
};

/**
 *
 */
EditorUi.prototype.getEditBlankXml = function () {
  return mxUtils.getXml(this.editor.getGraphXml());
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.getUrl = function (pathname) {
  var href = pathname != null ? pathname : window.location.pathname;
  var parms = href.indexOf('?') > 0 ? 1 : 0;

  // Removes template URL parameter for new blank diagram
  for (var key in urlParams) {
    if (parms == 0) {
      href += '?';
    } else {
      href += '&';
    }

    href += key + '=' + urlParams[key];
    parms++;
  }

  return href;
};

/**
 * Specifies if the graph has scrollbars.
 */
EditorUi.prototype.setScrollbars = function (value) {
  var graph = this.editor.graph;
  var prev = graph.container.style.overflow;
  graph.scrollbars = value;
  this.editor.updateGraphComponents();

  if (prev != graph.container.style.overflow) {
    graph.container.scrollTop = 0;
    graph.container.scrollLeft = 0;
    graph.view.scaleAndTranslate(1, 0, 0);
    this.resetScrollbars();
  }

  this.fireEvent(new mxEventObject('scrollbarsChanged'));
};

/**
 * Returns true if the graph has scrollbars.
 */
EditorUi.prototype.hasScrollbars = function () {
  return this.editor.graph.scrollbars;
};

// TEN9: Added to help reset horizontal view
/**
 * Resets the state of the horizontal scrollbar.
 */
EditorUi.prototype.resetHorizontalScrollbar = function () {
  var graph = this.editor.graph;

  if (!this.editor.extendCanvas) {
    graph.container.scrollLeft = 0;

    if (!mxUtils.hasScrollbars(graph.container)) {
      graph.view.setTranslate(0, 0);
    }
  } else if (!this.editor.isChromelessView()) {
    if (mxUtils.hasScrollbars(graph.container)) {
      if (graph.pageVisible) {
        var pad = graph.getPagePadding();
        graph.container.scrollLeft =
          Math.floor(
            Math.min(pad.x, (graph.container.scrollWidth - graph.container.clientWidth) / 2),
          ) - 1;

        // Scrolls graph to visible area
        var bounds = graph.getGraphBounds();

        if (bounds.width > 0) {
          if (bounds.x > graph.container.scrollLeft + graph.container.clientWidth * 0.9) {
            graph.container.scrollLeft = Math.min(
              bounds.x + bounds.width - graph.container.clientWidth,
              bounds.x - 10,
            );
          }
        }
      } else {
        var bounds = graph.getGraphBounds();
        var width = Math.max(bounds.width, graph.scrollTileSize.width * graph.view.scale);
        graph.container.scrollLeft = Math.floor(
          Math.max(0, bounds.x - Math.max(0, (graph.container.clientWidth - width) / 2)),
        );
      }
    } else {
      var b = mxRectangle.fromRectangle(
        graph.pageVisible ? graph.view.getBackgroundPageBounds() : graph.getGraphBounds(),
      );
      var tr = graph.view.translate;
      var s = graph.view.scale;
      b.x = b.x / s - tr.x;
      b.width /= s;

      graph.view.setTranslate(
        Math.floor(Math.max(0, (graph.container.clientWidth - b.width) / 2) - b.x + 2),
        0,
      );
    }
  }
};

// TEN9: TODO: Use incorporate resetHorizontalScrollbar back into here
/**
 * Resets the state of the scrollbars.
 */
EditorUi.prototype.resetScrollbars = function () {
  var graph = this.editor.graph;

  if (!this.editor.extendCanvas) {
    graph.container.scrollTop = 0;
    graph.container.scrollLeft = 0;

    if (!mxUtils.hasScrollbars(graph.container)) {
      graph.view.setTranslate(0, 0);
    }
  } else if (!this.editor.isChromelessView()) {
    if (mxUtils.hasScrollbars(graph.container)) {
      if (graph.pageVisible) {
        var pad = graph.getPagePadding();
        graph.container.scrollTop = Math.floor(pad.y - this.editor.initialTopSpacing) - 1;
        graph.container.scrollLeft =
          Math.floor(
            Math.min(pad.x, (graph.container.scrollWidth - graph.container.clientWidth) / 2),
          ) - 1;

        // Scrolls graph to visible area
        var bounds = graph.getGraphBounds();

        if (bounds.width > 0 && bounds.height > 0) {
          if (bounds.x > graph.container.scrollLeft + graph.container.clientWidth * 0.9) {
            graph.container.scrollLeft = Math.min(
              bounds.x + bounds.width - graph.container.clientWidth,
              bounds.x - 10,
            );
          }

          if (bounds.y > graph.container.scrollTop + graph.container.clientHeight * 0.9) {
            graph.container.scrollTop = Math.min(
              bounds.y + bounds.height - graph.container.clientHeight,
              bounds.y - 10,
            );
          }
        }
      } else {
        var bounds = graph.getGraphBounds();
        var width = Math.max(bounds.width, graph.scrollTileSize.width * graph.view.scale);
        var height = Math.max(bounds.height, graph.scrollTileSize.height * graph.view.scale);
        graph.container.scrollTop = Math.floor(
          Math.max(0, bounds.y - Math.max(20, (graph.container.clientHeight - height) / 4)),
        );
        graph.container.scrollLeft = Math.floor(
          Math.max(0, bounds.x - Math.max(0, (graph.container.clientWidth - width) / 2)),
        );
      }
    } else {
      var b = mxRectangle.fromRectangle(
        graph.pageVisible ? graph.view.getBackgroundPageBounds() : graph.getGraphBounds(),
      );
      var tr = graph.view.translate;
      var s = graph.view.scale;
      b.x = b.x / s - tr.x;
      b.y = b.y / s - tr.y;
      b.width /= s;
      b.height /= s;

      var dy = graph.pageVisible ? 0 : Math.max(0, (graph.container.clientHeight - b.height) / 4);

      graph.view.setTranslate(
        Math.floor(Math.max(0, (graph.container.clientWidth - b.width) / 2) - b.x + 2),
        Math.floor(dy - b.y + 1),
      );
    }
  }
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageVisible = function (value) {
  var graph = this.editor.graph;
  var hasScrollbars = mxUtils.hasScrollbars(graph.container);
  var tx = 0;
  var ty = 0;

  if (hasScrollbars) {
    tx = graph.view.translate.x * graph.view.scale - graph.container.scrollLeft;
    ty = graph.view.translate.y * graph.view.scale - graph.container.scrollTop;
  }

  graph.pageVisible = value;
  graph.pageBreaksVisible = value;
  graph.preferPageSize = value;
  graph.view.validateBackground();

  // Workaround for possible handle offset
  if (hasScrollbars) {
    var cells = graph.getSelectionCells();
    graph.clearSelection();
    graph.setSelectionCells(cells);
  }

  // Calls updatePageBreaks
  graph.sizeDidChange();

  if (hasScrollbars) {
    graph.container.scrollLeft = graph.view.translate.x * graph.view.scale - tx;
    graph.container.scrollTop = graph.view.translate.y * graph.view.scale - ty;
  }

  this.fireEvent(new mxEventObject('pageViewChanged'));
};

/**
 * Class: ChangeGridColor
 *
 * Undoable change to grid color.
 */
function ChangeGridColor(ui, color) {
  this.ui = ui;
  this.color = color;
}

/**
 * Executes selection of a new page.
 */
ChangeGridColor.prototype.execute = function () {
  var temp = this.ui.editor.graph.view.gridColor;
  this.ui.setGridColor(this.color);
  this.color = temp;
};

// Registers codec for ChangePageSetup
(function () {
  var codec = new mxObjectCodec(new ChangeGridColor(), ['ui']);

  mxCodecRegistry.register(codec);
})();

/**
 * Change types
 */

var ChangePageSetup = function (ui, color, image, format, pageScale) {
  this.ui = ui;
  this.color = color;
  this.previousColor = color;
  this.image = image;
  this.previousImage = image;
  this.format = format;
  this.previousFormat = format;
  this.pageScale = pageScale;
  this.previousPageScale = pageScale;

  // Needed since null are valid values for color and image
  this.ignoreColor = false;
  this.ignoreImage = false;
}

/**
 * Implementation of the undoable page rename.
 */
ChangePageSetup.prototype.execute = function () {
  var graph = this.ui.editor.graph;

  if (!this.ignoreColor) {
    this.color = this.previousColor;
    var tmp = graph.background;
    this.ui.setBackgroundColor(this.previousColor);
    this.previousColor = tmp;
  }

  if (!this.ignoreImage) {
    this.image = this.previousImage;
    var tmp = graph.backgroundImage;
    this.ui.setBackgroundImage(this.previousImage);
    this.previousImage = tmp;
  }

  if (this.previousFormat != null) {
    this.format = this.previousFormat;
    var tmp = graph.pageFormat;

    if (this.previousFormat.width != tmp.width || this.previousFormat.height != tmp.height) {
      this.ui.setPageFormat(this.previousFormat);
      this.previousFormat = tmp;
    }
  }

  if (this.foldingEnabled != null && this.foldingEnabled != this.ui.editor.graph.foldingEnabled) {
    this.ui.setFoldingEnabled(this.foldingEnabled);
    this.foldingEnabled = !this.foldingEnabled;
  }

  if (this.previousPageScale != null) {
    var currentPageScale = this.ui.editor.graph.pageScale;

    if (this.previousPageScale != currentPageScale) {
      this.ui.setPageScale(this.previousPageScale);
      this.previousPageScale = currentPageScale;
    }
  }
};

// Registers codec for ChangePageSetup
(function () {
  var codec = new mxObjectCodec(new ChangePageSetup(), [
    'ui',
    'previousColor',
    'previousImage',
    'previousFormat',
    'previousPageScale',
  ]);

  codec.afterDecode = function (dec, node, obj) {
    obj.previousColor = obj.color;
    obj.previousImage = obj.image;
    obj.previousFormat = obj.format;
    obj.previousPageScale = obj.pageScale;

    if (obj.foldingEnabled != null) {
      obj.foldingEnabled = !obj.foldingEnabled;
    }

    return obj;
  };

  mxCodecRegistry.register(codec);
})();

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setBackgroundColor = function (value) {
  this.editor.graph.background = value;
  this.editor.graph.view.validateBackground();

  this.fireEvent(new mxEventObject('backgroundColorChanged'));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setFoldingEnabled = function (value) {
  this.editor.graph.foldingEnabled = value;
  this.editor.graph.view.revalidate();

  this.fireEvent(new mxEventObject('foldingEnabledChanged'));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageFormat = function (value) {
  this.editor.graph.pageFormat = value;

  if (!this.editor.graph.pageVisible) {
    this.actions.get('pageView').funct();
  } else {
    this.editor.graph.view.validateBackground();
    this.editor.graph.sizeDidChange();
  }

  this.fireEvent(new mxEventObject('pageFormatChanged'));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageScale = function (value) {
  this.editor.graph.pageScale = value;

  if (!this.editor.graph.pageVisible) {
    this.actions.get('pageView').funct();
  } else {
    this.editor.graph.view.validateBackground();
    this.editor.graph.sizeDidChange();
  }

  this.fireEvent(new mxEventObject('pageScaleChanged'));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setGridColor = function (value) {
  this.editor.graph.view.gridColor = value;
  this.editor.graph.view.validateBackground();
  this.fireEvent(new mxEventObject('gridColorChanged'));
};

/**
 * Updates the states of the given undo/redo items.
 */
EditorUi.prototype.addUndoListener = function () {
  var undo = this.actions.get('undo');
  var redo = this.actions.get('redo');

  var undoMgr = this.editor.undoManager;

  var undoListener = mxUtils.bind(this, function () {
    undo.setEnabled(this.canUndo());
    redo.setEnabled(this.canRedo());
  });

  undoMgr.addListener(mxEvent.ADD, undoListener);
  undoMgr.addListener(mxEvent.UNDO, undoListener);
  undoMgr.addListener(mxEvent.REDO, undoListener);
  undoMgr.addListener(mxEvent.CLEAR, undoListener);

  // Overrides cell editor to update action states
  var cellEditorStartEditing = this.editor.graph.cellEditor.startEditing;

  this.editor.graph.cellEditor.startEditing = function () {
    cellEditorStartEditing.apply(this, arguments);
    undoListener();
  };

  var cellEditorStopEditing = this.editor.graph.cellEditor.stopEditing;

  this.editor.graph.cellEditor.stopEditing = function (cell, trigger) {
    cellEditorStopEditing.apply(this, arguments);
    undoListener();
  };

  // Updates the button states once
  undoListener();
};

/**
 * Updates the states of the given toolbar items based on the selection.
 */
EditorUi.prototype.updateActionStates = function () {
  var graph = this.editor.graph;
  var selected = !graph.isSelectionEmpty();
  var vertexSelected = false;
  var groupSelected = false;
  var edgeSelected = false;

  var cells = graph.getSelectionCells();

  if (cells != null) {
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];

      if (graph.getModel().isEdge(cell)) {
        edgeSelected = true;
      }

      if (graph.getModel().isVertex(cell)) {
        vertexSelected = true;

        if (graph.getModel().getChildCount(cell) > 0 || graph.isContainer(cell)) {
          groupSelected = true;
        }
      }

      if (edgeSelected && vertexSelected) {
        break;
      }
    }
  }

  // Updates action states
  var actions = [
    'cut',
    'copy',
    'bold',
    'italic',
    'underline',
    'delete',
    'duplicate',
    'editStyle',
    'editTooltip',
    'editLink',
    'backgroundColor',
    'borderColor',
    'edit',
    'toFront',
    'toBack',
    'lockUnlock',
    'solid',
    'dashed',
    'pasteSize',
    'dotted',
    'fillColor',
    'gradientColor',
    'shadow',
    'fontColor',
    'formattedText',
    'rounded',
    'toggleRounded',
    'sharp',
    'strokeColor',
  ];

  for (var i = 0; i < actions.length; i++) {
    this.actions.get(actions[i]).setEnabled(selected);
  }

  this.actions.get('setAsDefaultStyle').setEnabled(graph.getSelectionCount() == 1);
  this.actions.get('clearWaypoints').setEnabled(!graph.isSelectionEmpty());
  this.actions.get('copySize').setEnabled(graph.getSelectionCount() == 1);
  this.actions.get('turn').setEnabled(!graph.isSelectionEmpty());
  this.actions.get('curved').setEnabled(edgeSelected);
  this.actions.get('rotation').setEnabled(vertexSelected);
  this.actions.get('wordWrap').setEnabled(vertexSelected);
  this.actions.get('autosize').setEnabled(vertexSelected);
  var oneVertexSelected = vertexSelected && graph.getSelectionCount() == 1;
  this.actions
    .get('group')
    .setEnabled(
      graph.getSelectionCount() > 1 ||
        (oneVertexSelected && !graph.isContainer(graph.getSelectionCell())),
    );
  this.actions.get('ungroup').setEnabled(groupSelected);
  this.actions
    .get('removeFromGroup')
    .setEnabled(
      oneVertexSelected &&
        graph.getModel().isVertex(graph.getModel().getParent(graph.getSelectionCell())),
    );

  // Updates menu states
  var state = graph.view.getState(graph.getSelectionCell());
  this.menus.get('navigation').setEnabled(selected || graph.view.currentRoot != null);
  this.actions
    .get('collapsible')
    .setEnabled(
      vertexSelected &&
        (graph.isContainer(graph.getSelectionCell()) ||
          graph.model.getChildCount(graph.getSelectionCell()) > 0),
    );
  this.actions.get('home').setEnabled(graph.view.currentRoot != null);
  this.actions.get('exitGroup').setEnabled(graph.view.currentRoot != null);
  this.actions
    .get('enterGroup')
    .setEnabled(graph.getSelectionCount() == 1 && graph.isValidRoot(graph.getSelectionCell()));
  var foldable = graph.getSelectionCount() == 1 && graph.isCellFoldable(graph.getSelectionCell());
  this.actions.get('expand').setEnabled(foldable);
  this.actions.get('collapse').setEnabled(foldable);
  this.actions.get('editLink').setEnabled(graph.getSelectionCount() == 1);
  this.actions
    .get('openLink')
    .setEnabled(
      graph.getSelectionCount() == 1 && graph.getLinkForCell(graph.getSelectionCell()) != null,
    );
  this.actions.get('guides').setEnabled(graph.isEnabled());
  this.actions.get('grid').setEnabled(!this.editor.chromeless || this.editor.editable);

  var unlocked = graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent());
  // TEN9: FIXED to run when this.menus is null
  if (this.menus != null) {
    this.menus.get('layout').setEnabled(unlocked);
    this.menus.get('insert').setEnabled(unlocked);
    this.menus.get('direction').setEnabled(unlocked && vertexSelected);
    this.menus.get('align').setEnabled(unlocked && vertexSelected && graph.getSelectionCount() > 1);
    this.menus
      .get('distribute')
      .setEnabled(unlocked && vertexSelected && graph.getSelectionCount() > 1);
  }
  this.actions.get('selectVertices').setEnabled(unlocked);
  this.actions.get('selectEdges').setEnabled(unlocked);
  this.actions.get('selectAll').setEnabled(unlocked);
  this.actions.get('selectNone').setEnabled(unlocked);

  this.updatePasteActionStates();
};

EditorUi.prototype.zeroOffset = new mxPoint(0, 0);

EditorUi.prototype.getDiagramContainerOffset = function () {
  return this.zeroOffset;
};

/**
 * Refreshes the viewport.
 */
EditorUi.prototype.refresh = function (sizeDidChange) {
  sizeDidChange = sizeDidChange != null ? sizeDidChange : true;

  var quirks = mxClient.IS_IE && (document.documentMode == null || document.documentMode == 5);
  var w = this.container.clientWidth;
  var h = this.container.clientHeight;

  if (this.container == document.body) {
    w = document.body.clientWidth || document.documentElement.clientWidth;
    h = quirks
      ? document.body.clientHeight || document.documentElement.clientHeight
      : document.documentElement.clientHeight;
  }

  // Workaround for bug on iOS see
  // http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue
  // FIXME: Fix if footer visible
  var off = 0;

  if (mxClient.IS_IOS && !window.navigator.standalone) {
    if (window.innerHeight != document.documentElement.clientHeight) {
      off = document.documentElement.clientHeight - window.innerHeight;
      window.scrollTo(0, 0);
    }
  }

  var effHsplitPosition = Math.max(0, Math.min(this.hsplitPosition, w - this.splitSize - 20));
  var tmp = 0;

  if (this.menubar != null) {
    this.menubarContainer.style.height = this.menubarHeight + 'px';
    tmp += this.menubarHeight;
  }

  if (this.toolbar != null) {
    this.toolbarContainer.style.top = this.menubarHeight + 'px';
    this.toolbarContainer.style.height = this.toolbarHeight + 'px';
    tmp += this.toolbarHeight;
  }

  if (tmp > 0 && !mxClient.IS_QUIRKS) {
    tmp += 1;
  }

  var sidebarFooterHeight = 0;

  if (this.sidebarFooterContainer != null) {
    var bottom = this.footerHeight + off;
    sidebarFooterHeight = Math.max(0, Math.min(h - tmp - bottom, this.sidebarFooterHeight));
    this.sidebarFooterContainer.style.width = effHsplitPosition + 'px';
    this.sidebarFooterContainer.style.height = sidebarFooterHeight + 'px';
    this.sidebarFooterContainer.style.bottom = bottom + 'px';
  }

  this.sidebarContainer.style.height =
    this.diagramContainer.offsetHeight - this.sidebarFooterHeight + 'px';

  var fw = this.format != null ? this.formatWidth : 0;
  this.sidebarContainer.style.top = tmp + 'px';
  this.sidebarContainer.style.width = effHsplitPosition + 'px';
  this.formatContainer.style.top = tmp + 'px';
  this.formatContainer.style.width = fw + 'px';
  this.formatContainer.style.display = this.format != null ? '' : 'none';

  var diagContOffset = this.getDiagramContainerOffset();
  var contLeft = this.hsplit.parentNode != null ? effHsplitPosition + this.splitSize : 0;

  // TEN9: check if preview mode is on then don't change the diagramContainer position
  if (this.enabled) {
    this.diagramContainer.style.left = contLeft + diagContOffset.x + 'px';
  }

  this.diagramContainer.style.top = tmp + diagContOffset.y + 'px';
  this.footerContainer.style.height = this.footerHeight + 'px';
  this.hsplit.style.top = this.sidebarContainer.style.top;
  this.hsplit.style.bottom = this.footerHeight + off + 'px';
  this.hsplit.style.left = effHsplitPosition + 'px';
  this.footerContainer.style.display = this.footerHeight == 0 ? 'none' : '';

  if (this.tabContainer != null) {
    this.tabContainer.style.left = contLeft + 'px';
  }

  if (quirks) {
    this.menubarContainer.style.width = w + 'px';
    this.toolbarContainer.style.width = this.menubarContainer.style.width;
    var sidebarHeight = Math.max(
      0,
      h - this.footerHeight - this.menubarHeight - this.toolbarHeight,
    );
    this.sidebarContainer.style.height = sidebarHeight - sidebarFooterHeight + 'px';
    this.formatContainer.style.height = sidebarHeight + 'px';
    this.diagramContainer.style.width =
      this.hsplit.parentNode != null
        ? Math.max(0, w - effHsplitPosition - this.splitSize - fw) + 'px'
        : w + 'px';
    this.footerContainer.style.width = this.menubarContainer.style.width;
    var diagramHeight = Math.max(
      0,
      h - this.footerHeight - this.menubarHeight - this.toolbarHeight,
    );

    if (this.tabContainer != null) {
      this.tabContainer.style.width = this.diagramContainer.style.width;
      this.tabContainer.style.bottom = this.footerHeight + off + 'px';
      diagramHeight -= this.tabContainer.clientHeight;
    }

    this.diagramContainer.style.height = diagramHeight + 'px';
    this.hsplit.style.height = diagramHeight + 'px';
  } else {
    if (this.footerHeight > 0) {
      this.footerContainer.style.bottom = off + 'px';
    }

    this.diagramContainer.style.right = fw + 'px';
    var th = 0;

    if (this.tabContainer != null) {
      this.tabContainer.style.bottom = this.footerHeight + off + 'px';
      this.tabContainer.style.right = this.diagramContainer.style.right;
      th = this.tabContainer.clientHeight;
    }

    this.sidebarContainer.style.bottom = this.footerHeight + sidebarFooterHeight + off + 'px';
    this.formatContainer.style.bottom = this.footerHeight + off + 'px';
    this.diagramContainer.style.bottom = this.footerHeight + off + th + 'px';
  }

  if (sizeDidChange) {
    this.editor.graph.sizeDidChange();
  }
  
  this.updateTabContainer()
};

/**
 * Creates the required containers.
 */
EditorUi.prototype.createTabContainer = function() {
  // TEN9: Adding More Tabs Div
  //return null;
  var div = document.createElement('div');
	div.className = 'geTabContainer';
	div.style.position = 'absolute';
	div.style.whiteSpace = 'nowrap';
	div.style.overflow = 'hidden';
	div.style.height = '0px';

	return div;
};

/**
 * Creates the required containers.
 */
EditorUi.prototype.createDivs = function () {
  this.menubarContainer = this.createDiv('geMenubarContainer');
  this.toolbarContainer = this.createDiv('geToolbarContainer');
  this.sidebarContainer = this.createDiv('geSidebarContainer');
  this.formatContainer = this.createDiv('geSidebarContainer geFormatContainer');
  this.diagramContainer = this.createDiv('geDiagramContainer');
  this.footerContainer = this.createDiv('geFooterContainer');
  this.hsplit = this.createDiv('geHsplit');
  this.hsplit.setAttribute('title', mxResources.get('collapseExpand'));

  // Sets static style for containers
  this.menubarContainer.style.top = '0px';
  this.menubarContainer.style.left = '0px';
  this.menubarContainer.style.right = '0px';
  this.toolbarContainer.style.left = '0px';
  this.toolbarContainer.style.right = '0px';
  this.sidebarContainer.style.left = '0px';
  this.formatContainer.style.right = '0px';
  this.formatContainer.style.zIndex = '1';
  this.diagramContainer.style.right = (this.format != null ? this.formatWidth : 0) + 'px';
  this.footerContainer.style.left = '0px';
  this.footerContainer.style.right = '0px';
  this.footerContainer.style.bottom = '0px';
  // TEN9: Removed z-index since it conflicts with some modals and
  //       we're not using this right now.
  // this.footerContainer.style.zIndex = mxPopupMenu.prototype.zIndex - 2;
  this.hsplit.style.width = this.splitSize + 'px';
  this.sidebarFooterContainer = this.createSidebarFooterContainer();

  if (this.sidebarFooterContainer) {
    this.sidebarFooterContainer.style.left = '0px';
  }

  if (!this.editor.chromeless) {
    this.tabContainer = this.createTabContainer();
  } else {
    this.diagramContainer.style.border = 'none';
  }
};

// TEN9: Bring in sidebar footer
/**
 * Hook for sidebar footer container.
 */
EditorUi.prototype.createSidebarFooterContainer = function () {
  // TEN9: add add more shaep div in footer
  //return null;
  var div = this.createDiv('geSidebarContainer geSidebarFooter');
  div.style.position = 'absolute';
  div.style.overflow = 'hidden';

  var elt2 = document.createElement('a');
  elt2.className = 'geTitle';
  elt2.style.color = '#DF6C0C';
  elt2.style.fontWeight = 'bold';
  elt2.style.height = '100%';
  elt2.style.paddingTop = '9px';
  elt2.innerHTML = '<span style="font-size:18px;margin-right:5px;">+</span>';

  mxUtils.write(elt2, mxResources.get('moreShapes') + '...');

  // Prevents focus
  mxEvent.addListener(
    elt2,
    mxClient.IS_POINTER ? 'pointerdown' : 'mousedown',
    mxUtils.bind(this, function (evt) {
      evt.preventDefault();
    }),
  );

  mxEvent.addListener(
    elt2,
    'click',
    mxUtils.bind(this, function (evt) {
      this.actions.get('shapes').funct();
      mxEvent.consume(evt);
    }),
  );

  div.appendChild(elt2);

  return div;
};

/**
 * Creates the required containers.
 */
EditorUi.prototype.createUi = function () {
  // Creates menubar
  this.menubar = this.editor.chromeless
    ? null
    : this.menus.createMenubar(this.createDiv('geMenubar'));

  if (this.menubar != null) {
    this.menubarContainer.appendChild(this.menubar.container);
  }

  // Adds status bar in menubar
  if (this.menubar != null) {
    this.statusContainer = this.createStatusContainer();

    // Connects the status bar to the editor status
    this.editor.addListener(
      'statusChanged',
      mxUtils.bind(this, function () {
        this.setStatusText(this.editor.getStatus());
      }),
    );

    this.setStatusText(this.editor.getStatus());
    this.menubar.container.appendChild(this.statusContainer);

    // Inserts into DOM
    this.container.appendChild(this.menubarContainer);
  }

  // Creates the sidebar
  this.sidebar = this.editor.chromeless ? null : this.createSidebar(this.sidebarContainer);

  if (this.sidebar != null) {
    this.container.appendChild(this.sidebarContainer);
  }

  // Creates the format sidebar
  this.format =
    this.editor.chromeless || !this.formatEnabled ? null : this.createFormat(this.formatContainer);

  if (this.format != null) {
    this.container.appendChild(this.formatContainer);
  }

  // Creates the footer
  var footer = this.editor.chromeless ? null : this.createFooter();

  if (footer != null) {
    this.footerContainer.appendChild(footer);
    this.container.appendChild(this.footerContainer);
  }

  if (this.sidebar != null && this.sidebarFooterContainer) {
    this.container.appendChild(this.sidebarFooterContainer);
  }

  this.container.appendChild(this.diagramContainer);

  if (this.container != null && this.tabContainer != null) {
    this.container.appendChild(this.tabContainer);
  }

  // Creates toolbar
  this.toolbar = this.editor.chromeless ? null : this.createToolbar(this.createDiv('geToolbar'));

  if (this.toolbar != null) {
    this.toolbarContainer.appendChild(this.toolbar.container);
    this.container.appendChild(this.toolbarContainer);
  }

  // HSplit
  if (this.sidebar != null) {
    this.container.appendChild(this.hsplit);

    this.addSplitHandler(
      this.hsplit,
      true,
      0,
      mxUtils.bind(this, function (value) {
        this.hsplitPosition = value;
        this.refresh();
      }),
    );
  }
};

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.createStatusContainer = function () {
  var container = document.createElement('a');
  container.className = 'geItem geStatus';

  return container;
};

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.setStatusText = function (value) {
  this.statusContainer.innerHTML = value;
};

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.createToolbar = function (container) {
  // TEN9: To avoid import cycles
  return new Toolbar(this, container, EditorUi);
};

/**
 * Creates a new sidebar for the given container.
 */
EditorUi.prototype.createSidebar = function (container) {
  // TEN9: To avoid import cycles
  return new Sidebar(this, container, Dialog);
};

/**
 * Creates a new sidebar for the given container.
 */
EditorUi.prototype.createFormat = function (container) {
  // TEN9: To avoid import cycles
  return new Format(this, container, ChangePageSetup, ChangeGridColor);
};

/**
 * Creates and returns a new footer.
 */
EditorUi.prototype.createFooter = function () {
  return this.createDiv('geFooter');
};

/**
 * Creates the actual toolbar for the toolbar container.
 */
EditorUi.prototype.createDiv = function (classname) {
  var elt = document.createElement('div');
  elt.className = classname;
  return elt;
};

/**
 * Updates the states of the given undo/redo items.
 */
EditorUi.prototype.addSplitHandler = function (elt, horizontal, dx, onChange) {
  var start = null;
  var initial = null;
  var ignoreClick = true;
  var last = null;

  // Disables built-in pan and zoom in IE10 and later
  if (mxClient.IS_POINTER) {
    elt.style.touchAction = 'none';
  }

  var getValue = mxUtils.bind(this, function () {
    var result = parseInt(horizontal ? elt.style.left : elt.style.bottom);

    // Takes into account hidden footer
    if (!horizontal) {
      result = result + dx - this.footerHeight;
    }

    return result;
  });

  function moveHandler(evt) {
    if (start != null) {
      var pt = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
      onChange(Math.max(0, initial + (horizontal ? pt.x - start.x : start.y - pt.y) - dx));
      mxEvent.consume(evt);

      if (initial != getValue()) {
        ignoreClick = true;
        last = null;
      }
    }
  }

  function dropHandler(evt) {
    moveHandler(evt);
    initial = null;
    start = null;
  }

  mxEvent.addGestureListeners(elt, function (evt) {
    start = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
    initial = getValue();
    ignoreClick = false;
    mxEvent.consume(evt);
  });

  mxEvent.addListener(
    elt,
    'click',
    mxUtils.bind(this, function (evt) {
      if (!ignoreClick && this.hsplitClickEnabled) {
        var next = last != null ? last - dx : 0;
        last = getValue();
        onChange(next);
        mxEvent.consume(evt);
      }
    }),
  );

  mxEvent.addGestureListeners(document, null, moveHandler, dropHandler);

  this.destroyFunctions.push(function () {
    mxEvent.removeGestureListeners(document, null, moveHandler, dropHandler);
  });
};

/**
 * Translates this point by the given vector.
 *
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
EditorUi.prototype.handleError = function (resp, title, fn, invokeFnOnClose, notFoundMessage) {
  var e = resp != null && resp.error != null ? resp.error : resp;

  if (e != null || title != null) {
    var msg = mxUtils.htmlEntities(mxResources.get('unknownError'));
    var btn = mxResources.get('ok');
    title = title != null ? title : mxResources.get('error');

    if (e != null && e.message != null) {
      msg = mxUtils.htmlEntities(e.message);
    }

    this.showError(
      title,
      msg,
      btn,
      fn,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      invokeFnOnClose ? fn : null,
    );
  } else if (fn != null) {
    fn();
  }
};

/**
 * Translates this point by the given vector.
 *
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
EditorUi.prototype.showError = function (
  title,
  msg,
  btn,
  fn,
  retry,
  btn2,
  fn2,
  btn3,
  fn3,
  w,
  h,
  hide,
  onClose,
) {
  var dlg = new ErrorDialog(
    this,
    title,
    msg,
    btn || mxResources.get('ok'),
    fn,
    retry,
    btn2,
    fn2,
    hide,
    btn3,
    fn3,
  );
  var lines = Math.ceil(msg != null ? msg.length / 50 : 1);
  this.showDialog(dlg.container, w || 340, h || 100 + lines * 20, true, false, onClose);
  dlg.init();
};

/**
 * Displays a print dialog.
 */
EditorUi.prototype.showDialog = function (
  elt,
  w,
  h,
  modal,
  closable,
  onClose,
  noScroll,
  transparent,
  onResize,
  ignoreBgClick,
) {
  this.editor.graph.tooltipHandler.hideTooltip();

  if (this.dialogs == null) {
    this.dialogs = [];
  }

  this.dialog = new Dialog(
    this,
    elt,
    w,
    h,
    modal,
    closable,
    onClose,
    noScroll,
    transparent,
    onResize,
    ignoreBgClick,
  );
  this.dialogs.push(this.dialog);
};

/**
 * Displays a print dialog.
 */
EditorUi.prototype.hideDialog = function (cancel, isEsc) {
  if (this.dialogs != null && this.dialogs.length > 0) {
    var dlg = this.dialogs.pop();

    if (dlg.close(cancel, isEsc) == false) {
      //add the dialog back if dialog closing is cancelled
      this.dialogs.push(dlg);
      return;
    }

    this.dialog = this.dialogs.length > 0 ? this.dialogs[this.dialogs.length - 1] : null;
    this.editor.fireEvent(new mxEventObject('hideDialog'));

    if (this.dialog == null && this.editor.graph.container.style.visibility != 'hidden') {
      window.setTimeout(
        mxUtils.bind(this, function () {
          if (this.editor.graph.isEditing() && this.editor.graph.cellEditor.textarea != null) {
            this.editor.graph.cellEditor.textarea.focus();
          } else {
            mxUtils.clearSelection();
            this.editor.graph.container.focus();
          }
        }),
        0,
      );
    }
  }
};

/**
 * Handles ctrl+enter keystroke to clone cells.
 */
EditorUi.prototype.ctrlEnter = function () {
  var graph = this.editor.graph;

  if (graph.isEnabled()) {
    try {
      var cells = graph.getSelectionCells();
      var lookup = new mxDictionary();
      var newCells = [];

      for (var i = 0; i < cells.length; i++) {
        // Clones table rows instead of cells
        var cell = graph.isTableCell(cells[i]) ? graph.model.getParent(cells[i]) : cells[i];

        if (cell != null && !lookup.get(cell)) {
          lookup.put(cell, true);
          newCells.push(cell);
        }
      }

      graph.setSelectionCells(graph.duplicateCells(newCells, false));
    } catch (e) {
      this.handleError(e);
    }
  }
};

/**
 * Display a color dialog.
 */
EditorUi.prototype.pickColor = function (color, apply) {
  var graph = this.editor.graph;
  var selState = graph.cellEditor.saveSelection();
  var h =
    226 +
    (Math.ceil(ColorDialog.prototype.presetColors.length / 12) +
      Math.ceil(ColorDialog.prototype.defaultColors.length / 12)) *
      17;

  var dlg = new ColorDialog(
    this,
    color || 'none',
    function (color) {
      graph.cellEditor.restoreSelection(selState);
      apply(color);
    },
    function () {
      graph.cellEditor.restoreSelection(selState);
    },
  );
  this.showDialog(dlg.container, 230, h, true, false);
  dlg.init();
};

/**
 * Adds the label menu items to the given menu and parent.
 */
EditorUi.prototype.openFile = function () {
  // Closes dialog after open
  window.openFile = new OpenFile(
    mxUtils.bind(this, function (cancel) {
      this.hideDialog(cancel);
    }),
  );
  // Removes openFile if dialog is closed
  this.showDialog(
    new OpenDialog(this).container,
    Editor.useLocalStorage ? 640 : 320,
    Editor.useLocalStorage ? 480 : 220,
    true,
    true,
    function () {
      window.openFile = null;
    },
  );
};

/**
 * Extracs the graph model from the given HTML data from a data transfer event.
 */
EditorUi.prototype.extractGraphModelFromHtml = function (data) {
  var result = null;

  try {
    var idx = data.indexOf('&lt;mxGraphModel ');

    if (idx >= 0) {
      var idx2 = data.lastIndexOf('&lt;/mxGraphModel&gt;');

      if (idx2 > idx) {
        result = data
          .substring(idx, idx2 + 21)
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/\\&quot;/g, '"')
          .replace(/\n/g, '');
      }
    }
  } catch (e) {
    // ignore
  }

  return result;
};

/**
 * Opens the given files in the editor.
 */
EditorUi.prototype.extractGraphModelFromEvent = function (evt) {
  var result = null;
  var data = null;

  if (evt != null) {
    var provider = evt.dataTransfer != null ? evt.dataTransfer : evt.clipboardData;

    if (provider != null) {
      if (document.documentMode == 10 || document.documentMode == 11) {
        data = provider.getData('Text');
      } else {
        data =
          mxUtils.indexOf(provider.types, 'text/html') >= 0 ? provider.getData('text/html') : null;

        if (mxUtils.indexOf(provider.types, 'text/plain' && (data == null || data.length == 0))) {
          data = provider.getData('text/plain');
        }
      }

      if (data != null) {
        data = Graph.zapGremlins(mxUtils.trim(data));

        // Tries parsing as HTML document with embedded XML
        var xml = this.extractGraphModelFromHtml(data);

        if (xml != null) {
          data = xml;
        }
      }
    }
  }

  if (data != null && this.isCompatibleString(data)) {
    result = data;
  }

  return result;
};

// TEN9: Brought over from diagramly
/**
 * Returns true if the given string contains a compatible graph model.
 */
EditorUi.prototype.isCompatibleString = function (data) {
  try {
    var doc = mxUtils.parseXml(data);
    var node = this.editor.extractGraphModel(doc.documentElement, true);

    return node != null && node.getElementsByTagName('parsererror').length == 0;
  } catch (e) {
    // ignore
  }

  return false;
};

// TEN9: Commenting out default in favor of diagramly one above.
// /**
//  * Hook for subclassers to return true if event data is a supported format.
//  * This implementation always returns false.
//  */
// EditorUi.prototype.isCompatibleString = function (data) {
//   return false;
// };

/**
 * Adds the label menu items to the given menu and parent.
 */
EditorUi.prototype.saveFile = function (forceDialog) {
  if (!forceDialog && this.editor.filename != null) {
    this.save(this.editor.getOrCreateFilename());
  } else {
    var dlg = new FilenameDialog(
      this,
      this.editor.getOrCreateFilename(),
      mxResources.get('save'),
      mxUtils.bind(this, function (name) {
        this.save(name);
      }),
      null,
      mxUtils.bind(this, function (name) {
        if (name != null && name.length > 0) {
          return true;
        }

        mxUtils.confirm(mxResources.get('invalidName'));

        return false;
      }),
    );
    this.showDialog(dlg.container, 300, 100, true, true);
    dlg.init();
  }
};

/**
 * Saves the current graph under the given filename.
 */
EditorUi.prototype.save = function (name) {
  if (name != null) {
    if (this.editor.graph.isEditing()) {
      this.editor.graph.stopEditing();
    }

    var xml = mxUtils.getXml(this.editor.getGraphXml());

    try {
      if (Editor.useLocalStorage) {
        if (
          localStorage.getItem(name) != null &&
          !mxUtils.confirm(mxResources.get('replaceIt', [name]))
        ) {
          return;
        }

        localStorage.setItem(name, xml);
        this.editor.setStatus(mxUtils.htmlEntities(mxResources.get('saved')) + ' ' + new Date());
      } else {
        if (xml.length < MAX_REQUEST_SIZE) {
          new mxXmlRequest(
            SAVE_URL,
            'filename=' + encodeURIComponent(name) + '&xml=' + encodeURIComponent(xml),
          ).simulate(document, '_blank');
        } else {
          mxUtils.alert(mxResources.get('drawingTooLarge'));
          mxUtils.popup(xml);

          return;
        }
      }

      this.editor.setModified(false);
      this.editor.setFilename(name);
      this.updateDocumentTitle();
    } catch (e) {
      this.editor.setStatus(mxUtils.htmlEntities(mxResources.get('errorSavingFile')));
    }
  }
};

/**
 * Executes the given layout.
 */
EditorUi.prototype.executeLayout = function (exec, animate, post) {
  var graph = this.editor.graph;

  if (graph.isEnabled()) {
    graph.getModel().beginUpdate();
    try {
      exec();
    } catch (e) {
      throw e;
    } finally {
      // Animates the changes in the graph model except
      // for Camino, where animation is too slow
      if (
        this.allowAnimation &&
        animate &&
        (navigator.userAgent == null || navigator.userAgent.indexOf('Camino') < 0)
      ) {
        // New API for animating graph layout results asynchronously
        var morph = new mxMorphing(graph);
        morph.addListener(
          mxEvent.DONE,
          mxUtils.bind(this, function () {
            graph.getModel().endUpdate();

            if (post != null) {
              post();
            }
          }),
        );

        morph.startAnimation();
      } else {
        graph.getModel().endUpdate();

        if (post != null) {
          post();
        }
      }
    }
  }
};

/**
 * Hides the current menu.
 */
EditorUi.prototype.showImageDialog = function (title, value, fn, ignoreExisting) {
  var cellEditor = this.editor.graph.cellEditor;
  var selState = cellEditor.saveSelection();
  var newValue = mxUtils.prompt(title, value);
  cellEditor.restoreSelection(selState);

  if (newValue != null && newValue.length > 0) {
    var img = new Image();

    img.onload = function () {
      fn(newValue, img.width, img.height);
    };
    img.onerror = function () {
      fn(null);
      mxUtils.alert(mxResources.get('fileNotFound'));
    };

    img.src = newValue;
  } else {
    fn(null);
  }
};

/**
 * Hides the current menu.
 */
EditorUi.prototype.showLinkDialog = function (value, btnLabel, fn) {
  var dlg = new LinkDialog(this, value, btnLabel, fn);
  this.showDialog(dlg.container, 420, 90, true, true);
  dlg.init();
};

/**
 * Hides the current menu.
 */
EditorUi.prototype.showDataDialog = function (cell) {
  if (cell != null) {
    var dlg = new EditDataDialog(this, cell);
    this.showDialog(dlg.container, 480, 420, true, false, null, false);
    dlg.init();
  }
};

/**
 * Hides the current menu.
 */
EditorUi.prototype.showBackgroundImageDialog = function (apply, img) {
  apply =
    apply != null
      ? apply
      : mxUtils.bind(this, function (image) {
          var change = new ChangePageSetup(this, null, image);
          change.ignoreColor = true;

          this.editor.graph.model.execute(change);
        });

  var newValue = mxUtils.prompt(mxResources.get('backgroundImage'), img != null ? img.src : '');

  if (newValue != null && newValue.length > 0) {
    var img = new Image();

    img.onload = function () {
      apply(new mxImage(newValue, img.width, img.height), false);
    };
    img.onerror = function () {
      apply(null, true);
      mxUtils.alert(mxResources.get('fileNotFound'));
    };

    img.src = newValue;
  } else {
    apply(null);
  }
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setBackgroundImage = function (image) {
  this.editor.graph.setBackgroundImage(image);
  this.editor.graph.view.validateBackgroundImage();

  this.fireEvent(new mxEventObject('backgroundImageChanged'));
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.confirm = function (msg, okFn, cancelFn) {
  if (mxUtils.confirm(msg)) {
    if (okFn != null) {
      okFn();
    }
  } else if (cancelFn != null) {
    cancelFn();
  }
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.createOutline = function (wnd) {
  var outline = new mxOutline(this.editor.graph);
  outline.border = 20;

  mxEvent.addListener(window, 'resize', function () {
    outline.update();
  });

  this.addListener('pageFormatChanged', function () {
    outline.update();
  });

  return outline;
};

// Alt+Shift+Keycode mapping to action
EditorUi.prototype.altShiftActions = {
  67: 'clearWaypoints', // Alt+Shift+C
  65: 'connectionArrows', // Alt+Shift+A
  76: 'editLink', // Alt+Shift+L
  80: 'connectionPoints', // Alt+Shift+P
  84: 'editTooltip', // Alt+Shift+T
  86: 'pasteSize', // Alt+Shift+V
  88: 'copySize', // Alt+Shift+X
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.createKeyHandler = function (editor) {
  var editorUi = this;
  var graph = this.editor.graph;
  var keyHandler = new mxKeyHandler(graph);

  var isEventIgnored = keyHandler.isEventIgnored;
  keyHandler.isEventIgnored = function (evt) {
    // Handles undo/redo/ctrl+./,/u via action and allows ctrl+b/i
    // only if editing value is HTML (except for FF and Safari)
    return (
      !(mxEvent.isShiftDown(evt) && evt.keyCode == 9) &&
      (!this.isControlDown(evt) ||
        mxEvent.isShiftDown(evt) ||
        (evt.keyCode != 90 &&
          evt.keyCode != 89 &&
          evt.keyCode != 188 &&
          evt.keyCode != 190 &&
          evt.keyCode != 85)) &&
      ((evt.keyCode != 66 && evt.keyCode != 73) ||
        !this.isControlDown(evt) ||
        (this.graph.cellEditor.isContentEditing() && !mxClient.IS_FF && !mxClient.IS_SF)) &&
      isEventIgnored.apply(this, arguments)
    );
  };

  // Ignores graph enabled state but not chromeless state
  keyHandler.isEnabledForEvent = function (evt) {
    return (
      !mxEvent.isConsumed(evt) &&
      this.isGraphEvent(evt) &&
      this.isEnabled() &&
      (editorUi.dialogs == null || editorUi.dialogs.length == 0)
    );
  };

  // Routes command-key to control-key on Mac
  keyHandler.isControlDown = function (evt) {
    return mxEvent.isControlDown(evt) || (mxClient.IS_MAC && evt.metaKey);
  };

  var queue = [];
  var thread = null;

  // Helper function to move cells with the cursor keys
  function nudge(keyCode, stepSize, resize) {
    queue.push(function () {
      if (!graph.isSelectionEmpty() && graph.isEnabled()) {
        stepSize = stepSize != null ? stepSize : 1;

        if (resize) {
          // Resizes all selected vertices
          graph.getModel().beginUpdate();
          try {
            var cells = graph.getSelectionCells();

            for (var i = 0; i < cells.length; i++) {
              if (graph.getModel().isVertex(cells[i]) && graph.isCellResizable(cells[i])) {
                var geo = graph.getCellGeometry(cells[i]);

                if (geo != null) {
                  geo = geo.clone();

                  if (keyCode == 37) {
                    geo.width = Math.max(0, geo.width - stepSize);
                  } else if (keyCode == 38) {
                    geo.height = Math.max(0, geo.height - stepSize);
                  } else if (keyCode == 39) {
                    geo.width += stepSize;
                  } else if (keyCode == 40) {
                    geo.height += stepSize;
                  }

                  graph.getModel().setGeometry(cells[i], geo);
                }
              }
            }
          } finally {
            graph.getModel().endUpdate();
          }
        } else {
          // Moves vertices up/down in a stack layout
          var cell = graph.getSelectionCell();
          var parent = graph.model.getParent(cell);
          var layout = null;

          if (
            graph.getSelectionCount() == 1 &&
            graph.model.isVertex(cell) &&
            graph.layoutManager != null &&
            !graph.isCellLocked(cell)
          ) {
            layout = graph.layoutManager.getLayout(parent);
          }

          if (layout != null && layout.constructor == mxStackLayout) {
            var index = parent.getIndex(cell);

            if (keyCode == 37 || keyCode == 38) {
              graph.model.add(parent, cell, Math.max(0, index - 1));
            } else if (keyCode == 39 || keyCode == 40) {
              graph.model.add(parent, cell, Math.min(graph.model.getChildCount(parent), index + 1));
            }
          } else {
            var cells = graph.getMovableCells(graph.getSelectionCells());
            var realCells = [];

            for (var i = 0; i < cells.length; i++) {
              // TODO: Use getCompositeParent
              var style = graph.getCurrentCellStyle(cells[i]);

              if (mxUtils.getValue(style, 'part', '0') == '1') {
                var parent = graph.model.getParent(cells[i]);

                if (graph.model.isVertex(parent) && mxUtils.indexOf(cells, parent) < 0) {
                  realCells.push(parent);
                }
              } else {
                realCells.push(cells[i]);
              }
            }

            if (realCells.length > 0) {
              cells = realCells;
              var dx = 0;
              var dy = 0;

              if (keyCode == 37) {
                dx = -stepSize;
              } else if (keyCode == 38) {
                dy = -stepSize;
              } else if (keyCode == 39) {
                dx = stepSize;
              } else if (keyCode == 40) {
                dy = stepSize;
              }

              graph.moveCells(cells, dx, dy);
            }
          }
        }
      }
    });

    if (thread != null) {
      window.clearTimeout(thread);
    }

    thread = window.setTimeout(function () {
      if (queue.length > 0) {
        graph.getModel().beginUpdate();

        try {
          for (var i = 0; i < queue.length; i++) {
            queue[i]();
          }

          queue = [];
        } finally {
          graph.getModel().endUpdate();
        }
      }
    }, 200);
  }

  // Overridden to handle special alt+shift+cursor keyboard shortcuts
  var directions = {
    37: mxConstants.DIRECTION_WEST,
    38: mxConstants.DIRECTION_NORTH,
    39: mxConstants.DIRECTION_EAST,
    40: mxConstants.DIRECTION_SOUTH,
  };

  var keyHandlerGetFunction = keyHandler.getFunction;

  mxKeyHandler.prototype.getFunction = function (evt) {
    if (graph.isEnabled()) {
      // TODO: Add alt modified state in core API, here are some specific cases
      if (mxEvent.isShiftDown(evt) && mxEvent.isAltDown(evt)) {
        var action = editorUi.actions.get(editorUi.altShiftActions[evt.keyCode]);

        if (action != null) {
          return action.funct;
        }
      }

      if (evt.keyCode == 9 && mxEvent.isAltDown(evt)) {
        if (graph.cellEditor.isContentEditing()) {
          // Alt+Shift+Tab while editing
          return function () {
            document.execCommand('outdent', false, null);
          };
        } else if (mxEvent.isShiftDown(evt)) {
          // Alt+Shift+Tab
          return function () {
            graph.selectParentCell();
          };
        } else {
          // Alt+Tab
          return function () {
            graph.selectChildCell();
          };
        }
      } else if (directions[evt.keyCode] != null && !graph.isSelectionEmpty()) {
        // On macOS, Control+Cursor is used by Expose so allow for Alt+Control to resize
        if (!this.isControlDown(evt) && mxEvent.isShiftDown(evt) && mxEvent.isAltDown(evt)) {
          if (graph.model.isVertex(graph.getSelectionCell())) {
            return function () {
              var cells = graph.connectVertex(
                graph.getSelectionCell(),
                directions[evt.keyCode],
                graph.defaultEdgeLength,
                evt,
                true,
              );

              if (cells != null && cells.length > 0) {
                if (cells.length == 1 && graph.model.isEdge(cells[0])) {
                  graph.setSelectionCell(graph.model.getTerminal(cells[0], false));
                } else {
                  graph.setSelectionCell(cells[cells.length - 1]);
                }

                graph.scrollCellToVisible(graph.getSelectionCell());

                if (editorUi.hoverIcons != null) {
                  editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
                }
              }
            };
          }
        } else {
          // Avoids consuming event if no vertex is selected by returning null below
          // Cursor keys move and resize (ctrl) cells
          if (this.isControlDown(evt)) {
            return function () {
              nudge(evt.keyCode, mxEvent.isShiftDown(evt) ? graph.gridSize : null, true);
            };
          } else {
            return function () {
              nudge(evt.keyCode, mxEvent.isShiftDown(evt) ? graph.gridSize : null);
            };
          }
        }
      }
    }

    return keyHandlerGetFunction.apply(this, arguments);
  };

  // Binds keystrokes to actions
  keyHandler.bindAction = mxUtils.bind(this, function (code, control, key, shift) {
    var action = this.actions.get(key);

    if (action != null) {
      var f = function () {
        if (action.isEnabled()) {
          action.funct();
        }
      };

      if (control) {
        if (shift) {
          keyHandler.bindControlShiftKey(code, f);
        } else {
          keyHandler.bindControlKey(code, f);
        }
      } else {
        if (shift) {
          keyHandler.bindShiftKey(code, f);
        } else {
          keyHandler.bindKey(code, f);
        }
      }
    }
  });

  var ui = this;
  var keyHandlerEscape = keyHandler.escape;
  keyHandler.escape = function (evt) {
    keyHandlerEscape.apply(this, arguments);
  };

  // Ignores enter keystroke. Remove this line if you want the
  // enter keystroke to stop editing. N, W, T are reserved.
  keyHandler.enter = function () {};

  keyHandler.bindControlShiftKey(36, function () {
    graph.exitGroup();
  }); // Ctrl+Shift+Home
  keyHandler.bindControlShiftKey(35, function () {
    graph.enterGroup();
  }); // Ctrl+Shift+End
  keyHandler.bindShiftKey(36, function () {
    graph.home();
  }); // Ctrl+Shift+Home
  keyHandler.bindKey(35, function () {
    graph.refresh();
  }); // End
  keyHandler.bindAction(107, true, 'zoomIn'); // Ctrl+Plus
  keyHandler.bindAction(109, true, 'zoomOut'); // Ctrl+Minus
  keyHandler.bindAction(80, true, 'print'); // Ctrl+P
  keyHandler.bindAction(79, true, 'outline', true); // Ctrl+Shift+O

  if (!this.editor.chromeless || this.editor.editable) {
    keyHandler.bindControlKey(36, function () {
      if (graph.isEnabled()) {
        graph.foldCells(true);
      }
    }); // Ctrl+Home
    keyHandler.bindControlKey(35, function () {
      if (graph.isEnabled()) {
        graph.foldCells(false);
      }
    }); // Ctrl+End
    keyHandler.bindControlKey(13, function () {
      ui.ctrlEnter();
    }); // Ctrl+Enter
    keyHandler.bindAction(8, false, 'delete'); // Backspace
    keyHandler.bindAction(8, true, 'deleteAll'); // Ctrl+Backspace
    keyHandler.bindAction(8, false, 'deleteLabels', true); // Shift+Backspace
    keyHandler.bindAction(46, false, 'delete'); // Delete
    keyHandler.bindAction(46, true, 'deleteAll'); // Ctrl+Delete
    keyHandler.bindAction(46, false, 'deleteLabels', true); // Shift+Delete
    keyHandler.bindAction(36, false, 'resetView'); // Home
    keyHandler.bindAction(72, true, 'fitWindow', true); // Ctrl+Shift+H
    keyHandler.bindAction(74, true, 'fitPage'); // Ctrl+J
    keyHandler.bindAction(74, true, 'fitTwoPages', true); // Ctrl+Shift+J
    keyHandler.bindAction(48, true, 'customZoom'); // Ctrl+0
    keyHandler.bindAction(82, true, 'turn'); // Ctrl+R
    keyHandler.bindAction(82, true, 'clearDefaultStyle', true); // Ctrl+Shift+R
    // TEN9: Disable Save and SaveAs
    // keyHandler.bindAction(83, true, 'save'); // Ctrl+S
    // keyHandler.bindAction(83, true, 'saveAs', true); // Ctrl+Shift+S
    keyHandler.bindAction(65, true, 'selectAll'); // Ctrl+A
    keyHandler.bindAction(65, true, 'selectNone', true); // Ctrl+A
    keyHandler.bindAction(73, true, 'selectVertices', true); // Ctrl+Shift+I
    keyHandler.bindAction(69, true, 'selectEdges', true); // Ctrl+Shift+E
    keyHandler.bindAction(69, true, 'editStyle'); // Ctrl+E
    keyHandler.bindAction(66, true, 'bold'); // Ctrl+B
    keyHandler.bindAction(66, true, 'toBack', true); // Ctrl+Shift+B
    keyHandler.bindAction(70, true, 'toFront', true); // Ctrl+Shift+F
    keyHandler.bindAction(68, true, 'duplicate'); // Ctrl+D
    keyHandler.bindAction(68, true, 'setAsDefaultStyle', true); // Ctrl+Shift+D
    keyHandler.bindAction(90, true, 'undo'); // Ctrl+Z
    keyHandler.bindAction(89, true, 'autosize', true); // Ctrl+Shift+Y
    keyHandler.bindAction(88, true, 'cut'); // Ctrl+X
    keyHandler.bindAction(67, true, 'copy'); // Ctrl+C
    // TEN9: To disable default grapheditor Ctrl+C & Ctrl+v behaviour
    // keyHandler.bindAction(86, true, 'paste'); // Ctrl+V
    keyHandler.bindAction(71, true, 'group'); // Ctrl+G
    keyHandler.bindAction(77, true, 'editData'); // Ctrl+M
    keyHandler.bindAction(71, true, 'grid', true); // Ctrl+Shift+G
    keyHandler.bindAction(73, true, 'italic'); // Ctrl+I
    keyHandler.bindAction(76, true, 'lockUnlock'); // Ctrl+L
    keyHandler.bindAction(76, true, 'layers', true); // Ctrl+Shift+L
    keyHandler.bindAction(80, true, 'formatPanel', true); // Ctrl+Shift+P
    keyHandler.bindAction(85, true, 'underline'); // Ctrl+U
    keyHandler.bindAction(85, true, 'ungroup', true); // Ctrl+Shift+U
    keyHandler.bindAction(190, true, 'superscript'); // Ctrl+.
    keyHandler.bindAction(188, true, 'subscript'); // Ctrl+,
    keyHandler.bindAction(9, false, 'indent', true); // Shift+Tab,
    keyHandler.bindKey(13, function () {
      if (graph.isEnabled()) {
        graph.startEditingAtCell();
      }
    }); // Enter
    keyHandler.bindKey(113, function () {
      if (graph.isEnabled()) {
        graph.startEditingAtCell();
      }
    }); // F2
  }

  if (!mxClient.IS_WIN) {
    keyHandler.bindAction(90, true, 'redo', true); // Ctrl+Shift+Z
  } else {
    keyHandler.bindAction(89, true, 'redo'); // Ctrl+Y
  }

  return keyHandler;
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.destroy = function () {
  if (this.editor != null) {
    this.editor.destroy();
    this.editor = null;
  }

  if (this.menubar != null) {
    this.menubar.destroy();
    this.menubar = null;
  }

  if (this.toolbar != null) {
    this.toolbar.destroy();
    this.toolbar = null;
  }

  if (this.sidebar != null) {
    this.sidebar.destroy();
    this.sidebar = null;
  }

  if (this.keyHandler != null) {
    this.keyHandler.destroy();
    this.keyHandler = null;
  }

  if (this.keydownHandler != null) {
    mxEvent.removeListener(document, 'keydown', this.keydownHandler);
    this.keydownHandler = null;
  }

  if (this.keyupHandler != null) {
    mxEvent.removeListener(document, 'keyup', this.keyupHandler);
    this.keyupHandler = null;
  }

  if (this.resizeHandler != null) {
    mxEvent.removeListener(window, 'resize', this.resizeHandler);
    this.resizeHandler = null;
  }

  if (this.gestureHandler != null) {
    mxEvent.removeGestureListeners(document, this.gestureHandler);
    this.gestureHandler = null;
  }

  if (this.orientationChangeHandler != null) {
    mxEvent.removeListener(window, 'orientationchange', this.orientationChangeHandler);
    this.orientationChangeHandler = null;
  }

  if (this.scrollHandler != null) {
    mxEvent.removeListener(window, 'scroll', this.scrollHandler);
    this.scrollHandler = null;
  }

  if (this.destroyFunctions != null) {
    for (var i = 0; i < this.destroyFunctions.length; i++) {
      this.destroyFunctions[i]();
    }

    this.destroyFunctions = null;
  }

  var c = [
    this.menubarContainer,
    this.toolbarContainer,
    this.sidebarContainer,
    this.formatContainer,
    this.diagramContainer,
    this.footerContainer,
    this.chromelessToolbar,
    this.hsplit,
    this.sidebarFooterContainer,
    this.layersDialog,
  ];

  for (var i = 0; i < c.length; i++) {
    if (c[i] != null && c[i].parentNode != null) {
      c[i].parentNode.removeChild(c[i]);
    }
  }
};

// TEN9: add for more sheet
EditorUi.prototype.updateTabContainer = function()
{
	if (this.tabContainer != null && this.pages != null)
	{
		var graph = this.editor.graph;
		var wrapper = document.createElement('div');
		wrapper.style.position = 'relative';
		wrapper.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
		wrapper.style.verticalAlign = 'top';
		wrapper.style.height = this.tabContainer.style.height;
		wrapper.style.whiteSpace = 'nowrap';
		wrapper.style.overflow = 'hidden';
		wrapper.style.fontSize = '13px';
		
		// Allows for negative left margin of first tab
		wrapper.style.marginLeft = '30px';
		
		// Automatic tab width to match available width
		// TODO: Fix tabWidth in chromeless mode
		var btnWidth = (this.editor.isChromelessView()) ? 29 : 59;
		var tabWidth = Math.min(140, Math.max(20, (this.tabContainer.clientWidth - btnWidth) / this.pages.length) + 1);
		var startIndex = null;

		for (var i = 0; i < this.pages.length; i++)
		{
			// Install drag and drop for page reorder
			(mxUtils.bind(this, function(index, tab)
			{
				if (this.pages[index] == this.currentPage)
				{
					tab.className = 'geActivePage';
					tab.style.backgroundColor = (uiTheme == 'dark') ? '#2a2a2a' : '#fff';
				}
				else
				{
					tab.className = 'geInactivePage';
				}
				
				tab.setAttribute('draggable', 'true');
				
				mxEvent.addListener(tab, 'dragstart', mxUtils.bind(this, function(evt)
				{
					if (graph.isEnabled())
					{
						// Workaround for no DnD on DIV in FF
						if (mxClient.IS_FF)
						{
							// LATER: Check what triggers a parse as XML on this in FF after drop
							evt.dataTransfer.setData('Text', '<diagram/>');
						}
						
						startIndex = index;
					}
					else
					{
						// Blocks event
						mxEvent.consume(evt);
					}
				}));
				
				mxEvent.addListener(tab, 'dragend', mxUtils.bind(this, function(evt)
				{
					startIndex = null;
					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				mxEvent.addListener(tab, 'dragover', mxUtils.bind(this, function(evt)
				{
					if (startIndex != null)
					{
						evt.dataTransfer.dropEffect = 'move';
					}
					
					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				mxEvent.addListener(tab, 'drop', mxUtils.bind(this, function(evt)
				{
					if (startIndex != null && index != startIndex)
					{
						// LATER: Shift+drag for merge, ctrl+drag for clone 
						this.movePage(startIndex, index);
					}

					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				wrapper.appendChild(tab);
			}))(i, this.createTabForPage(this.pages[i], tabWidth, this.pages[i] != this.currentPage, i + 1));
		}
		
		this.tabContainer.innerHTML = '';
		this.tabContainer.appendChild(wrapper);
		
		// Adds floating menu with all pages and insert option
		var menutab = this.createPageMenuTab();
		this.tabContainer.appendChild(menutab);
		var insertTab = null;
		
		// Not chromeless and not read-only file
		if (this.isPageInsertTabVisible())
		{
			insertTab = this.createPageInsertTab();
			this.tabContainer.appendChild(insertTab);
		}

		if (wrapper.clientWidth > this.tabContainer.clientWidth - btnWidth)
		{
			if (insertTab != null)
			{
				insertTab.style.position = 'absolute';
				insertTab.style.right = '0px';
				wrapper.style.marginRight = '30px';
			}
			
			var temp = this.createControlTab(4, '&nbsp;&#10094;&nbsp;');
			temp.style.position = 'absolute';
			temp.style.right = (this.editor.chromeless) ? '29px' : '55px';
			temp.style.fontSize = '13pt';
			
			this.tabContainer.appendChild(temp);
			
			var temp2 = this.createControlTab(4, '&nbsp;&#10095;');
			temp2.style.position = 'absolute';
			temp2.style.right = (this.editor.chromeless) ? '0px' : '29px';
			temp2.style.fontSize = '13pt';
			
			this.tabContainer.appendChild(temp2);
			
			// TODO: Scroll to current page
			var dx = Math.max(0, this.tabContainer.clientWidth - ((this.editor.chromeless) ? 86 : 116));
			wrapper.style.width = dx + 'px';
			
			var fade = 50;
			
			mxEvent.addListener(temp, 'click', mxUtils.bind(this, function(evt)
			{
				wrapper.scrollLeft -= Math.max(20, dx - 20);
				mxUtils.setOpacity(temp, (wrapper.scrollLeft > 0) ? 100 : fade);
				mxUtils.setOpacity(temp2, (wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth) ? 100 : fade);
				mxEvent.consume(evt);
			}));
		
			mxUtils.setOpacity(temp, (wrapper.scrollLeft > 0) ? 100 : fade);
			mxUtils.setOpacity(temp2, (wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth) ? 100 : fade);

			mxEvent.addListener(temp2, 'click', mxUtils.bind(this, function(evt)
			{
				wrapper.scrollLeft += Math.max(20, dx - 20);
				mxUtils.setOpacity(temp, (wrapper.scrollLeft > 0) ? 100 : fade);
				mxUtils.setOpacity(temp2, (wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth) ? 100 : fade);
				mxEvent.consume(evt);
			}));
		}
	}
};



 require('../diagramly/LocalFile.js');
require('../diagramly/EditorUi.js');
require('../diagramly/Editor.js');
require('../diagramly/Pages.js');
require('../diagramly/Menus.js');
require('../diagramly/App.js');
// TEN9: Brought over from diagramly for native paste handler support
EditorUi.prototype.copyCells = function (elt, removeCells) {
  var graph = this.editor.graph;
  let xml = null;

  if (!graph.isSelectionEmpty()) {
    // Fixes cross-platform clipboard UTF8 issues by encoding as URI
    var cells = mxUtils.sortCells(graph.model.getTopmostCells(graph.getSelectionCells()));
    xml = mxUtils.getXml(graph.encodeCells(cells));
    mxUtils.setTextContent(elt, encodeURIComponent(xml));

    if (removeCells) {
      graph.removeCells(cells, false);
      graph.lastPasteXml = null;
    } else {
      graph.lastPasteXml = xml;
      graph.pasteCounter = 0;
    }

    // TEN9: Encode URI before returning the XML as this is for copying
    xml = encodeURIComponent(xml);

    elt.focus();
    document.execCommand('selectAll', false, null);
  } else {
    // Disables copy on focused element
    elt.innerHTML = '';
  }
  return xml;
};

// TEN9: Brought over from diagramly for native paste handler support
/**
 * Returns true for Gliffy
 */
EditorUi.prototype.isLucidChartData = function (data) {
  return false;
  // return data != null && (data.substring(0, 26) ==
  //   '{"state":"{\\"Properties\\":' ||
  //   data.substring(0, 14) == '{"Properties":');
};

// TEN9: Brought over from diagramly for native paste handler support
/**
 * Returns true for Gliffy data.
 */
EditorUi.prototype.isRemoteFileFormat = function (data, filename) {
  return false;
  // /(\"contentType\":\s*\"application\/gliffy\+json\")/.test(data);
};

// TEN9: Brought over from diagramly for native paste handler support
/**
 * Returns true if no external comms allowed or possible
 */
EditorUi.prototype.isOffline = function (ignoreStealth) {
  // return this.isOfflineApp() || !navigator.onLine || (!ignoreStealth && urlParams['stealth'] == '1');
  return !navigator.onLine;
};

// TEN9: Brought over from diagramly for native paste handler support
/**
 * Loads the image from the given URI.
 *
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
EditorUi.prototype.loadImage = function (uri, onload, onerror) {
  try {
    var img = new Image();

    img.onload = function () {
      img.width = img.width > 0 ? img.width : 120;
      img.height = img.height > 0 ? img.height : 120;

      onload(img);
    };

    if (onerror != null) {
      img.onerror = onerror;
    }

    img.src = uri;
  } catch (e) {
    if (onerror != null) {
      onerror(e);
    } else {
      throw e;
    }
  }
};

// TEN9: Brought over from diagramly for native paste handler support
/**
 * Handling drag and drop and import.
 */
// TEN9: Added param dontImportIntoDefaultLayer to assist when loading entire new file
/**
 * Imports the given XML into the existing diagram.
 */
EditorUi.prototype.importXml = function (
  xml,
  dx,
  dy,
  crop,
  noErrorHandling,
  dontImportIntoDefaultLayer = false,
) {
  dx = dx != null ? dx : 0;
  dy = dy != null ? dy : 0;
  var cells = [];

  try {
    var graph = this.editor.graph;

    if (xml != null && xml.length > 0) {
      // Adds pages
      graph.model.beginUpdate();
      try {
        var doc = mxUtils.parseXml(xml);
        var mapping = {};

        // Checks for mxfile with multiple pages
        var node = this.editor.extractGraphModel(doc.documentElement, this.pages != null);

        if (node != null && node.nodeName == 'mxfile' && this.pages != null) {
          var diagrams = node.getElementsByTagName('diagram');

          if (diagrams.length == 1) {
            node = Editor.parseDiagramNode(diagrams[0]);

            if (this.currentPage != null) {
              mapping[diagrams[0].getAttribute('id')] = this.currentPage.getId();
            }
          } else if (diagrams.length > 1) {
            var pages = [];
            var i0 = 0;

            // Adds first page to current page if current page is only page and empty
            if (this.pages != null && this.pages.length == 1 && this.isDiagramEmpty()) {
              mapping[diagrams[0].getAttribute('id')] = this.pages[0].getId();
              node = Editor.parseDiagramNode(diagrams[0]);
              crop = false;
              i0 = 1;
            }

            for (var i = i0; i < diagrams.length; i++) {
              // Imported pages must obtain a new ID and
              // all links to pages must be updated below
              var oldId = diagrams[i].getAttribute('id');
              diagrams[i].removeAttribute('id');

              var page = this.updatePageRoot(new DiagramPage(diagrams[i]));
              mapping[oldId] = diagrams[i].getAttribute('id');
              var index = this.pages.length;

              // Checks for invalid page names
              if (page.getName() == null) {
                page.setName(mxResources.get('pageWithNumber', [index + 1]));
              }

              graph.model.execute(new ChangePage(this, page, page, index, true));
              pages.push(page);
            }

            this.updatePageLinks(mapping, pages);
          }
        }

        if (node != null && node.nodeName === 'mxGraphModel') {
          // TEN9: Added param dontImportIntoDefaultLayer to assist when loading entire new file
          cells = graph.importGraphModel(node, dx, dy, crop, dontImportIntoDefaultLayer);

          if (cells != null) {
            for (var i = 0; i < cells.length; i++) {
              this.updatePageLinksForCell(mapping, cells[i]);
            }
          }
        }
      } finally {
        graph.model.endUpdate();
      }
    }
  } catch (e) {
    if (!noErrorHandling) {
      this.handleError(e);
    } else {
      throw e;
    }
  }

  return cells;
};

// TEN9: Brought over from diagramly for native paste handler support
/**
 * Updates links to pages in shapes and labels.
 */
EditorUi.prototype.updatePageLinks = function (mapping, pages) {
  for (var i = 0; i < pages.length; i++) {
    this.updatePageLinksForCell(mapping, pages[i].root);
  }
};

// TEN9: Brought over from diagramly for native paste handler support
/**
 * Updates links to pages in shapes and labels.
 */
EditorUi.prototype.updatePageLinksForCell = function (mapping, cell) {
  var temp = document.createElement('div');
  var graph = this.editor.graph;
  var href = graph.getLinkForCell(cell);

  if (href != null) {
    graph.setLinkForCell(cell, this.updatePageLink(mapping, href));
  }

  if (graph.isHtmlLabel(cell)) {
    temp.innerHTML = graph.sanitizeHtml(graph.getLabel(cell));
    var links = temp.getElementsByTagName('a');
    var changed = false;

    for (var i = 0; i < links.length; i++) {
      href = links[i].getAttribute('href');

      if (href != null) {
        links[i].setAttribute('href', this.updatePageLink(mapping, href));
        changed = true;
      }
    }

    if (changed) {
      graph.labelChanged(cell, temp.innerHTML);
    }
  }

  for (var i = 0; i < graph.model.getChildCount(cell); i++) {
    this.updatePageLinksForCell(mapping, graph.model.getChildAt(cell, i));
  }
};

// TEN9: Brought over from diagramly for native paste handler support
/**
 * Updates links to pages in shapes and labels.
 */
EditorUi.prototype.updatePageLink = function (mapping, href) {
  if (href.substring(0, 13) == 'data:page/id,') {
    var newId = mapping[href.substring(href.indexOf(',') + 1)];
    href = newId != null ? 'data:page/id,' + newId : null;
  } else if (href.substring(0, 17) == 'data:action/json,') {
    try {
      var link = JSON.parse(href.substring(17));

      if (link.actions != null) {
        for (var i = 0; i < link.actions.length; i++) {
          var action = link.actions[i];

          if (action.open != null && action.open.substring(0, 13) == 'data:page/id,') {
            var newId = mapping[action.open.substring(action.open.indexOf(',') + 1)];

            if (newId != null) {
              action.open = 'data:page/id,' + newId;
            } else {
              delete action.open;
            }
          }
        }

        href = 'data:action/json,' + JSON.stringify(link);
      }
    } catch (e) {
      // Ignore
    }
  }

  return href;
};

// TEN9: Brought over from diagramly for native paste handler support
/**
 * Imports the given XML into the existing diagram.
 * TODO: Make this function asynchronous
 */
EditorUi.prototype.insertTextAt = function (text, dx, dy, html, asImage, crop, resizeImages) {
  crop = crop != null ? crop : true;
  resizeImages = resizeImages != null ? resizeImages : true;

  // Handles special case for Gliffy data which requires async server-side for parsing
  if (text != null) {
    if (
      Graph.fileSupport &&
      !this.isOffline() &&
      new XMLHttpRequest().upload &&
      this.isRemoteFileFormat(text)
    ) {
      // Fixes possible parsing problems with ASCII 160 (non-breaking space)
      this.parseFile(
        new Blob([text.replace(/\s+/g, ' ')], { type: 'application/octet-stream' }),
        mxUtils.bind(this, function (xhr) {
          if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 299) {
            this.editor.graph.setSelectionCells(this.insertTextAt(xhr.responseText, dx, dy, true));
          }
        }),
      );

      // Returns empty cells array as it is aysynchronous
      return [];
    }
    // Handles special case of data URI which requires async loading for finding size
    else if (
      text.substring(0, 5) == 'data:' ||
      (!this.isOffline() && (asImage || /\.(gif|jpg|jpeg|tiff|png|svg)$/i.test(text)))
    ) {
      var graph = this.editor.graph;

      // Checks for embedded XML in PDF
      if (text.substring(0, 28) == 'data:application/pdf;base64,') {
        var xml = Editor.extractGraphModelFromPdf(text);

        if (xml != null && xml.length > 0) {
          return this.importXml(xml, dx, dy, crop, true);
        }
      }

      // Checks for embedded XML in PNG
      if (text.substring(0, 22) == 'data:image/png;base64,') {
        var xml = this.extractGraphModelFromPng(text);

        if (xml != null && xml.length > 0) {
          return this.importXml(xml, dx, dy, crop, true);
        }
      }

      // Tries to extract embedded XML from SVG data URI
      if (text.substring(0, 19) == 'data:image/svg+xml;') {
        try {
          var xml = null;

          if (text.substring(0, 26) == 'data:image/svg+xml;base64,') {
            xml = text.substring(text.indexOf(',') + 1);
            xml = window.atob && !mxClient.IS_SF ? atob(xml) : Base64.decode(xml, true);
          } else {
            xml = decodeURIComponent(text.substring(text.indexOf(',') + 1));
          }

          var result = this.importXml(xml, dx, dy, crop, true);

          if (result.length > 0) {
            return result;
          }
        } catch (e) {
          // Ignore
        }
      }

      this.loadImage(
        text,
        mxUtils.bind(this, function (img) {
          if (text.substring(0, 5) == 'data:') {
            this.resizeImage(
              img,
              text,
              mxUtils.bind(this, function (data2, w2, h2) {
                graph.setSelectionCell(
                  graph.insertVertex(
                    null,
                    null,
                    '',
                    graph.snap(dx),
                    graph.snap(dy),
                    w2,
                    h2,
                    'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
                      'verticalAlign=top;aspect=fixed;imageAspect=0;image=' +
                      this.convertDataUri(data2) +
                      ';',
                  ),
                );
              }),
              resizeImages,
              this.maxImageSize,
            );
          } else {
            var s = Math.min(
              1,
              Math.min(this.maxImageSize / img.width, this.maxImageSize / img.height),
            );
            var w = Math.round(img.width * s);
            var h = Math.round(img.height * s);

            graph.setSelectionCell(
              graph.insertVertex(
                null,
                null,
                '',
                graph.snap(dx),
                graph.snap(dy),
                w,
                h,
                'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
                  'verticalAlign=top;aspect=fixed;imageAspect=0;image=' +
                  text +
                  ';',
              ),
            );
          }
        }),
        mxUtils.bind(this, function () {
          var cell = null;

          // Inserts invalid data URIs as text
          graph.getModel().beginUpdate();
          try {
            cell = graph.insertVertex(
              graph.getDefaultParent(),
              null,
              text,
              graph.snap(dx),
              graph.snap(dy),
              1,
              1,
              'text;' + (html ? 'html=1;' : ''),
            );
            graph.updateCellSize(cell);
            graph.fireEvent(new mxEventObject('textInserted', 'cells', [cell]));
          } finally {
            graph.getModel().endUpdate();
          }

          graph.setSelectionCell(cell);
        }),
      );

      return [];
    } else {
      text = Graph.zapGremlins(mxUtils.trim(text));

      if (this.isCompatibleString(text)) {
        return this.importXml(text, dx, dy, crop);
      } else if (text.length > 0) {
        if (this.isLucidChartData(text)) {
          this.convertLucidChart(
            text,
            mxUtils.bind(this, function (xml) {
              this.editor.graph.setSelectionCells(this.importXml(xml, dx, dy, crop));
            }),
            mxUtils.bind(this, function (e) {
              this.handleError(e);
            }),
          );
        } else {
          var graph = this.editor.graph;
          var cell = null;

          graph.getModel().beginUpdate();
          try {
            // Fires cellsInserted to apply the current style to the inserted text.
            // This requires the value to be empty when the event is fired.
            cell = graph.insertVertex(
              graph.getDefaultParent(),
              null,
              '',
              graph.snap(dx),
              graph.snap(dy),
              1,
              1,
              'text;whiteSpace=wrap;' + (html ? 'html=1;' : ''),
            );
            graph.fireEvent(new mxEventObject('textInserted', 'cells', [cell]));

            // Single tag is converted
            if (text.charAt(0) == '<' && text.indexOf('>') == text.length - 1) {
              text = mxUtils.htmlEntities(text);
            }

            //TODO Refuse unsupported file types early as at this stage a lot of processing has beed done and time is wasted.
            //		For example, 5 MB PDF files is processed and then only 0.5 MB of meaningless text is added!
            //Limit labels to maxTextBytes
            if (text.length > this.maxTextBytes) {
              text = text.substring(0, this.maxTextBytes) + '...';
            }

            // Apply value and updates the cell size to fit the text block
            cell.value = text;
            graph.updateCellSize(cell);

            // Adds wrapping for large text blocks
            if (this.maxTextWidth > 0 && cell.geometry.width > this.maxTextWidth) {
              var size = graph.getPreferredSizeForCell(cell, this.maxTextWidth);
              cell.geometry.width = size.width;
              cell.geometry.height = size.height;
            }

            // See https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
            if (Graph.isLink(cell.value)) {
              graph.setLinkForCell(cell, cell.value);
            }

            // Adds spacing
            cell.geometry.width += graph.gridSize;
            cell.geometry.height += graph.gridSize;
          } finally {
            graph.getModel().endUpdate();
          }

          return [cell];
        }
      }
    }
  }

  return [];
};

// TEN9: Brought over from diagramly for native paste handler support
/**
 * Creates the format panel and adds overrides.
 */
EditorUi.prototype.pasteCells = function (evt, realElt, useEvent, pasteAsLabel) {
  if (!mxEvent.isConsumed(evt)) {
    // TEN9: if this is a file, let it bubble up as there's another handler
    // to take care of it.
    if (evt.clipboardData && evt.clipboardData.files.length > 0) {
      return;
    }

    var elt = realElt;
    var asHtml = false;

    if (useEvent && evt.clipboardData != null && evt.clipboardData.getData) {
      var data = evt.clipboardData.getData('text/html');

      // TEN9: Disable use of text/html data.
      data = null;

      if (data != null && data.length > 0) {
        var hasMeta = data.substring(0, 6) == '<meta ';
        elt = document.createElement('div');
        elt.innerHTML =
          (hasMeta ? '<meta charset="utf-8">' : '') + this.editor.graph.sanitizeHtml(data);
        asHtml = true;

        // Workaround for innerText not ignoring style elements in Chrome
        var styles = elt.getElementsByTagName('style');

        if (styles != null) {
          while (styles.length > 0) {
            styles[0].parentNode.removeChild(styles[0]);
          }
        }

        // Special case of link pasting from Chrome
        if (
          elt.firstChild != null &&
          elt.firstChild.nodeType == mxConstants.NODETYPE_ELEMENT &&
          elt.firstChild.nextSibling != null &&
          elt.firstChild.nextSibling.nodeType == mxConstants.NODETYPE_ELEMENT &&
          elt.firstChild.nodeName == 'META' &&
          elt.firstChild.nextSibling.nodeName == 'A' &&
          elt.firstChild.nextSibling.nextSibling == null
        ) {
          var temp =
            elt.firstChild.nextSibling.innerText == null
              ? mxUtils.getTextContent(elt.firstChild.nextSibling)
              : elt.firstChild.nextSibling.innerText;

          if (temp == elt.firstChild.nextSibling.getAttribute('href')) {
            mxUtils.setTextContent(elt, temp);
            asHtml = false;
          }
        }

        // Extracts single image source address
        var img = hasMeta && elt.firstChild != null ? elt.firstChild.nextSibling : elt.firstChild;

        if (
          img != null &&
          img.nextSibling == null &&
          img.nodeType == mxConstants.NODETYPE_ELEMENT &&
          img.nodeName == 'IMG'
        ) {
          var temp = img.getAttribute('src');

          if (temp != null) {
            mxUtils.setTextContent(elt, temp);
            asHtml = false;
          }
        }

        if (asHtml) {
          Graph.removePasteFormatting(elt);
        }
      } else {
        data = evt.clipboardData.getData('text/plain');

        if (data != null && data.length > 0) {
          elt = document.createElement('div');
          mxUtils.setTextContent(elt, data);
        }
      }
    }

    var spans = elt.getElementsByTagName('span');

    if (
      spans != null &&
      spans.length > 0 &&
      spans[0].getAttribute('data-lucid-type') === 'application/vnd.lucid.chart.objects'
    ) {
      var content = spans[0].getAttribute('data-lucid-content');

      if (content != null && content.length > 0) {
        this.convertLucidChart(
          content,
          mxUtils.bind(this, function (xml) {
            var graph = this.editor.graph;

            if (graph.lastPasteXml == xml) {
              graph.pasteCounter++;
            } else {
              graph.lastPasteXml = xml;
              graph.pasteCounter = 0;
            }

            var dx = graph.pasteCounter * graph.gridSize;
            graph.setSelectionCells(this.importXml(xml, dx, dx));
            graph.scrollCellToVisible(graph.getSelectionCell());
          }),
          mxUtils.bind(this, function (e) {
            this.handleError(e);
          }),
        );

        mxEvent.consume(evt);
      }
    } else {
      // KNOWN: Paste from IE11 to other browsers on Windows
      // seems to paste the contents of index.html
      var xml = asHtml
        ? elt.innerHTML
        : mxUtils.trim(elt.innerText == null ? mxUtils.getTextContent(elt) : elt.innerText);
      var compat = false;

      // Workaround for junk after XML in VM
      try {
        var idx = xml.lastIndexOf('%3E');

        if (idx >= 0 && idx < xml.length - 3) {
          xml = xml.substring(0, idx + 3);
        }
      } catch (e) {
        // ignore
      }

      // Checks for embedded XML content
      try {
        var spans = elt.getElementsByTagName('span');
        var tmp =
          spans != null && spans.length > 0
            ? mxUtils.trim(decodeURIComponent(spans[0].textContent))
            : decodeURIComponent(xml);

        if (this.isCompatibleString(tmp)) {
          compat = true;
          xml = tmp;
        }
      } catch (e) {
        // ignore
      }

      try {
        var graph = this.editor.graph;

        if (xml != null && xml.length > 0) {
          if (graph.lastPasteXml == xml) {
            graph.pasteCounter++;
          } else {
            graph.lastPasteXml = xml;
            graph.pasteCounter = 0;
          }

          var dx = graph.pasteCounter * graph.gridSize;

          if (compat || this.isCompatibleString(xml)) {
            graph.setSelectionCells(this.importXml(xml, dx, dx));
          } else if (pasteAsLabel && graph.getSelectionCount() == 1) {
            var cell = graph.getStartEditingCell(graph.getSelectionCell(), evt);

            if (
              /\.(gif|jpg|jpeg|tiff|png|svg)$/i.test(xml) &&
              graph.getCurrentCellStyle(cell)[mxConstants.STYLE_SHAPE] == 'image'
            ) {
              graph.setCellStyles(mxConstants.STYLE_IMAGE, xml, [cell]);
            } else {
              graph.labelChanged(cell, xml);

              if (Graph.isLink(xml)) {
                graph.setLinkForCell(cell, xml);
              }
            }

            graph.setSelectionCell(cell);
          } else {
            var pt = graph.getInsertPoint();

            if (graph.isMouseInsertPoint()) {
              dx = 0;

              // No offset for insert at mouse position
              if (graph.lastPasteXml == xml && graph.pasteCounter > 0) {
                graph.pasteCounter--;
              }
            }

            graph.setSelectionCells(this.insertTextAt(xml, pt.x + dx, pt.y + dx, true));
          }

          if (!graph.isSelectionEmpty()) {
            graph.scrollCellToVisible(graph.getSelectionCell());

            if (this.hoverIcons != null) {
              this.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
            }
          }

          try {
            mxEvent.consume(evt);
          } catch (e) {
            // ignore event no longer exists in async handler in IE8-
          }
        } else if (!useEvent) {
          graph.lastPasteXml = null;
          graph.pasteCounter = 0;
        }
      } catch (e) {
        this.handleError(e);
      }
    }
  }

  realElt.innerHTML = '&nbsp;';
};

// TEN9: Brought over from diagramly for native paste handler support
/**
 * Installs the native clipboard support.
 */
EditorUi.prototype.installNativeClipboardHandler = function () {
  var graph = this.editor.graph;

  // Focused but invisible textarea during control or meta key events
  // LATER: Disable text rendering to avoid delay while keeping focus
  var textInput = document.createElement('div');
  textInput.setAttribute('autocomplete', 'off');
  textInput.setAttribute('autocorrect', 'off');
  textInput.setAttribute('autocapitalize', 'off');
  textInput.setAttribute('spellcheck', 'false');
  textInput.style.textRendering = 'optimizeSpeed';
  textInput.style.fontFamily = 'monospace';
  textInput.style.wordBreak = 'break-all';
  textInput.style.background = 'transparent';
  textInput.style.color = 'transparent';
  textInput.style.position = 'absolute';
  textInput.style.whiteSpace = 'nowrap';
  textInput.style.overflow = 'hidden';
  textInput.style.display = 'block';
  textInput.style.fontSize = '1';
  textInput.style.zIndex = '-1';
  textInput.style.resize = 'none';
  textInput.style.outline = 'none';
  textInput.style.width = '1px';
  textInput.style.height = '1px';
  mxUtils.setOpacity(textInput, 0);
  textInput.contentEditable = true;
  textInput.innerHTML = '&nbsp;';

  var restoreFocus = false;

  // Disables built-in cut, copy and paste shortcuts
  this.keyHandler.bindControlKey(88, null);
  this.keyHandler.bindControlKey(67, null);
  this.keyHandler.bindControlKey(86, null);

  // Shows a textarea when control/cmd is pressed to handle native clipboard actions
  mxEvent.addListener(
    document,
    'keydown',
    mxUtils.bind(this, function (evt) {
      // No dialog visible
      var source = mxEvent.getSource(evt);

      if (
        graph.container != null &&
        graph.isEnabled() &&
        !graph.isMouseDown &&
        !graph.isEditing() &&
        this.dialog == null &&
        source.nodeName != 'INPUT' &&
        source.nodeName != 'TEXTAREA'
      ) {
        if (
          evt.keyCode == 224 /* FF */ ||
          (!mxClient.IS_MAC && evt.keyCode == 17) /* Control */ ||
          (mxClient.IS_MAC && (evt.keyCode == 91 || evt.keyCode == 93)) /* Left/Right Meta */
        ) {
          // Cannot use parentNode for check in IE
          if (!restoreFocus) {
            // Avoid autoscroll but allow handling of all pass-through ctrl shortcuts
            textInput.style.left = graph.container.scrollLeft + 10 + 'px';
            textInput.style.top = graph.container.scrollTop + 10 + 'px';

            graph.container.appendChild(textInput);
            restoreFocus = true;

            // Workaround for selected document content in quirks mode
            if (mxClient.IS_QUIRKS) {
              window.setTimeout(function () {
                textInput.focus();
                document.execCommand('selectAll', false, null);
              }, 0);
            } else {
              textInput.focus();
              document.execCommand('selectAll', false, null);
            }
          }
        }
      }
    }),
  );

  // Clears input and restores focus and selection
  function clearInput() {
    window.setTimeout(function () {
      textInput.innerHTML = '&nbsp;';
      textInput.focus();
      document.execCommand('selectAll', false, null);
    }, 0);
  }

  mxEvent.addListener(
    document,
    'keyup',
    mxUtils.bind(this, function (evt) {
      // Workaround for asynchronous event read invalid in IE quirks mode
      var keyCode = evt.keyCode;

      // Asynchronous workaround for scroll to origin after paste if the
      // Ctrl-key is not pressed for long enough in FF on Windows
      window.setTimeout(
        mxUtils.bind(this, function () {
          if (
            restoreFocus &&
            (keyCode == 224 /* FF */ ||
              keyCode == 17 /* Control */ ||
              keyCode == 91 /* Left Meta */ ||
              keyCode == 93) /* Right Meta */
          ) {
            restoreFocus = false;

            if (!graph.isEditing() && this.dialog == null && graph.container != null) {
              graph.container.focus();
            }

            textInput.parentNode.removeChild(textInput);

            // Workaround for lost cursor in focused element
            if (this.dialog == null) {
              mxUtils.clearSelection();
            }
          }
        }),
        0,
      );
    }),
  );

  mxEvent.addListener(
    textInput,
    'copy',
    mxUtils.bind(this, function (evt) {
      if (graph.isEnabled()) {
        try {
          mxClipboard.copy(graph);
          this.copyCells(textInput);
          clearInput();
        } catch (e) {
          this.handleError(e);
        }
      }
    }),
  );

  mxEvent.addListener(
    textInput,
    'cut',
    mxUtils.bind(this, function (evt) {
      if (graph.isEnabled()) {
        try {
          mxClipboard.copy(graph);
          this.copyCells(textInput, true);
          clearInput();
        } catch (e) {
          this.handleError(e);
        }
      }
    }),
  );

  mxEvent.addListener(
    textInput,
    'paste',
    mxUtils.bind(this, function (evt) {
      if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent())) {
        var t0 = new Date().getTime();
        textInput.innerHTML = '&nbsp;';
        textInput.focus();

        if (evt.clipboardData != null) {
          this.pasteCells(evt, textInput, true, true);
        }

        if (!mxEvent.isConsumed(evt)) {
          window.setTimeout(
            mxUtils.bind(this, function () {
              this.pasteCells(evt, textInput, false, true);
            }),
            0,
          );
        }
      }
    }),
    true,
  );

  // Needed for IE11
  var isSelectionAllowed2 = this.isSelectionAllowed;
  this.isSelectionAllowed = function (evt) {
    if (mxEvent.getSource(evt) == textInput) {
      return true;
    }

    return isSelectionAllowed2.apply(this, arguments);
  };

  return textInput;
};

// TEN9: Added exports
module.exports = {
  createEditorUi,
  EditorUi,
  ChangePageSetup
};
