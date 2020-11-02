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
  } = require('../jgraph/mxClient.js');

  let { ChangePageSetup } = require('../jgraph/EditorUi');
  let { Graph } = require('../jgraph/Graph');

/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
/**
 * Constructs a new point for the optional x and y coordinates. If no
 * coordinates are given, then the default values for <x> and <y> are used.
 * @constructor
 * @class Implements a basic 2D point. Known subclassers = {@link mxRectangle}.
 * @param {number} x X-coordinate of the point.
 * @param {number} y Y-coordinate of the point.
 */
/**
 * Global types
 */
function DiagramPage(node, id) {
	this.node = node;

	if (id != null) {
		this.node.setAttribute('id', id);
	}
	else if (this.getId() == null) {
		this.node.setAttribute('id', Editor.guid());
	}
};

/**
 * Holds the diagram node for the page.
 */
DiagramPage.prototype.node = null;

/**
 * Holds the root cell for the page.
 */
DiagramPage.prototype.root = null;

/**
 * Holds the view state for the page.
 */
DiagramPage.prototype.viewState = null;

/**
 * 
 */
DiagramPage.prototype.getId = function () {
	return this.node.getAttribute('id');
};

/**
 * 
 */
DiagramPage.prototype.getName = function () {
	return this.node.getAttribute('name');
};

/**
 * 
 */
DiagramPage.prototype.setName = function (value) {
	if (value == null) {
		this.node.removeAttribute('name');
	}
	else {
		this.node.setAttribute('name', value);
	}
};

/**
 * Change types
 */
function RenamePage(ui, page, name) {
	this.ui = ui;
	this.page = page;
	this.name = name;
	this.previous = name;
}

/**
 * Implementation of the undoable page rename.
 */
RenamePage.prototype.execute = function () {
	var tmp = this.page.getName();
	this.page.setName(this.previous);
	this.name = this.previous;
	this.previous = tmp;

	// Required to update page name in placeholders
	this.ui.editor.graph.updatePlaceholders();
	this.ui.editor.fireEvent(new mxEventObject('pageRenamed'));
};

/**
 * Undoable change of page title.
 */
function MovePage(ui, oldIndex, newIndex) {
	this.ui = ui;
	this.oldIndex = oldIndex;
	this.newIndex = newIndex;
}

/**
 * Implementation of the undoable page rename.
 */
MovePage.prototype.execute = function () {
	this.ui.pages.splice(this.newIndex, 0, this.ui.pages.splice(this.oldIndex, 1)[0]);
	var tmp = this.oldIndex;
	this.oldIndex = this.newIndex;
	this.newIndex = tmp;

	// Required to update page numbers in placeholders
	this.ui.editor.graph.updatePlaceholders();
	this.ui.editor.fireEvent(new mxEventObject('pageMoved'));
};

/**
 * Class: mxCurrentRootChange
 *
 * Action to change the current root in a view.
 *
 * Constructor: mxCurrentRootChange
 *
 * Constructs a change of the current root in the given view.
 */
function SelectPage(ui, page, viewState) {
	this.ui = ui;
	this.page = page;
	this.previousPage = page;
	this.neverShown = true;

	if (page != null) {
		this.neverShown = page.viewState == null;
		this.ui.updatePageRoot(page);

		if (viewState != null) {
			page.viewState = viewState;
			this.neverShown = false;
		}
	}
};

/**
 * Executes selection of a new page.
 */
SelectPage.prototype.execute = function () {
	var prevIndex = mxUtils.indexOf(this.ui.pages, this.previousPage);

	if (this.page != null && prevIndex >= 0) {
		var page = this.ui.currentPage;
		var editor = this.ui.editor;
		var graph = editor.graph;

		// Stores current diagram state in the page
		var data = Graph.compressNode(editor.getGraphXml(true));
		mxUtils.setTextContent(page.node, data);
		page.viewState = graph.getViewState();
		page.root = graph.model.root;

		if (page.model != null) {
			// Updates internal structures of offpage model
			page.model.rootChanged(page.root);
		}

		// Transitions for switching pages
		//		var curIndex = mxUtils.indexOf(this.ui.pages, page);
		//		mxUtils.setPrefixedStyle(graph.view.canvas.style, 'transition', null);
		//		mxUtils.setPrefixedStyle(graph.view.canvas.style, 'transform',
		//			(curIndex > prevIndex) ? 'translate(-50%,0)' : 'translate(50%,0)');

		// Removes the previous cells and clears selection
		graph.view.clear(page.root, true);
		graph.clearSelection();

		// Switches the current page
		this.ui.currentPage = this.previousPage;
		this.previousPage = page;
		page = this.ui.currentPage;

		// Switches the root cell and sets the view state
		graph.model.prefix = Editor.guid() + '-';
		graph.model.rootChanged(page.root);
		graph.setViewState(page.viewState);

		// Handles grid state in chromeless mode which is stored in Editor instance
		graph.gridEnabled = graph.gridEnabled && (!this.ui.editor.isChromelessView() ||
			urlParams['grid'] == '1');

		// Updates the display
		editor.updateGraphComponents();
		graph.view.validate();
		graph.blockMathRender = true;
		graph.sizeDidChange();
		graph.blockMathRender = false;

		//		mxUtils.setPrefixedStyle(graph.view.canvas.style, 'transition', 'transform 0.2s');
		//		mxUtils.setPrefixedStyle(graph.view.canvas.style, 'transform', 'translate(0,0)');

		if (this.neverShown) {
			this.neverShown = false;
			graph.selectUnlockedLayer();
		}

		// Fires events
		editor.graph.fireEvent(new mxEventObject(mxEvent.ROOT));
		editor.fireEvent(new mxEventObject('pageSelected', 'change', this));
	}
};

/**
 * 
 */
function ChangePage(ui, page, select, index, noSelect) {
	SelectPage.call(this, ui, select);
	this.relatedPage = page;
	this.index = index;
	this.previousIndex = null;
	this.noSelect = noSelect;
};

mxUtils.extend(ChangePage, SelectPage);

/**
 * Function: execute
 *
 * Changes the current root of the view.
 */
ChangePage.prototype.execute = function () {
	// Fires event to setting view state from realtime
	this.ui.editor.fireEvent(new mxEventObject('beforePageChange', 'change', this));
	this.previousIndex = this.index;

	if (this.index == null) {
		var tmp = mxUtils.indexOf(this.ui.pages, this.relatedPage);
		this.ui.pages.splice(tmp, 1);
		this.index = tmp;
	}
	else {
		this.ui.pages.splice(this.index, 0, this.relatedPage);
		this.index = null;
	}

	if (!this.noSelect) {
		SelectPage.prototype.execute.apply(this, arguments);
	}
};

// Overrides refresh to repaint tab container
var tabsContainer = function (EditorUi) {
	var editorUiRefresh = EditorUi.refresh;

	EditorUi.refresh = function (sizeDidChange) {
		editorUiRefresh.apply(this, arguments);
		
	}
	EditorUi.updateTabContainer();
}

//Overrides ChangePageSetup codec to exclude page
var changePages = function () {
	var codec = mxCodecRegistry.getCodec(ChangePageSetup);
	codec.exclude.push('page');
}

//Registers codec for MovePage
var pageMove = function () {
	var codec = new mxObjectCodec(new MovePage(), ['ui']);

	codec.beforeDecode = function (dec, node, obj) {
		obj.ui = dec.ui;

		return node;
	};

	codec.afterDecode = function (dec, node, obj) {
		var tmp = obj.oldIndex;
		obj.oldIndex = obj.newIndex;
		obj.newIndex = tmp;

		return obj;
	};

	mxCodecRegistry.register(codec);
};

//Registers codec for RenamePage
var pageRename = function () {
	var codec = new mxObjectCodec(new RenamePage(), ['ui', 'page']);

	codec.beforeDecode = function (dec, node, obj) {
		obj.ui = dec.ui;

		return node;
	};

	codec.afterDecode = function (dec, node, obj) {
		var tmp = obj.previous;
		obj.previous = obj.name;
		obj.name = tmp;

		return obj;
	};

	mxCodecRegistry.register(codec);
}

//Registers codec for ChangePage
var pageChange = function () {
	var codec = new mxObjectCodec(new ChangePage(), ['ui', 'relatedPage',
		'index', 'neverShown', 'page', 'previousPage']);

	var viewStateIgnored = ['defaultParent', 'currentRoot', 'scrollLeft',
		'scrollTop', 'scale', 'translate', 'lastPasteXml', 'pasteCounter'];

	codec.afterEncode = function (enc, obj, node) {
		node.setAttribute('relatedPage', obj.relatedPage.getId())

		if (obj.index == null) {
			node.setAttribute('name', obj.relatedPage.getName());

			if (obj.relatedPage.viewState != null) {
				node.setAttribute('viewState', JSON.stringify(
					obj.relatedPage.viewState, function (key, value) {
						return (mxUtils.indexOf(viewStateIgnored, key) < 0) ? value : undefined;
					}));
			}

			if (obj.relatedPage.root != null) {
				enc.encodeCell(obj.relatedPage.root, node);
			}
		}

		return node;
	};
	
	codec.beforeDecode = function (dec, node, obj) {
		obj.ui = dec.ui;
		obj.relatedPage = obj.ui.getPageById(node.getAttribute('relatedPage'));

		if (obj.relatedPage == null) {
			var temp = node.ownerDocument.createElement('diagram');
			temp.setAttribute('id', node.getAttribute('relatedPage'));
			temp.setAttribute('name', node.getAttribute('name'));
			obj.relatedPage = new DiagramPage(temp);

			var vs = node.getAttribute('viewState');

			if (vs != null) {
				obj.relatedPage.viewState = JSON.parse(vs);
				node.removeAttribute('viewState');
			}

			// Makes sure the original node isn't modified
			node = node.cloneNode(true);
			var tmp = node.firstChild;

			if (tmp != null) {
				obj.relatedPage.root = dec.decodeCell(tmp, false);

				var tmp2 = tmp.nextSibling;
				tmp.parentNode.removeChild(tmp);
				tmp = tmp2;

				while (tmp != null) {
					tmp2 = tmp.nextSibling;

					if (tmp.nodeType == mxConstants.NODETYPE_ELEMENT) {
						// Ignores all existing cells because those do not need to
						// be re-inserted into the model. Since the encoded version
						// of these cells contains the new parent, this would leave
						// to an inconsistent state on the model (ie. a parent
						// change without a call to parentForCellChanged).
						var id = tmp.getAttribute('id');

						if (dec.lookup(id) == null) {
							dec.decodeCell(tmp);
						}
					}

					tmp.parentNode.removeChild(tmp);
					tmp = tmp2;
				}
			}
		}

		return node;
	};

	codec.afterDecode = function (dec, node, obj) {
		obj.index = obj.previousIndex;

		return obj;
	};

    mxCodecRegistry.register(codec);
}

module.exports = {
pageChange,
pageRename,
pageMove,
tabsContainer
}