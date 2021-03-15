<!--
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
-->

<script lang="ts">
import { createEditorUi } from '../lib/jgraph/EditorUi';
import { createApp } from '../lib/diagramly/App';
import { createEditor } from '../lib/jgraph/Editor';
import { Graph } from '../lib/jgraph/Graph';
import { getImageData } from '../lib/shapes/fileIcons.js';
import { debounce } from 'lodash';
require('../lib/diagramly/DrawioFile.js');
require('../lib/diagramly/LocalFile.js');
require('../lib/diagramly/EditorUi.js');
require('../lib/diagramly/Editor.js');
require('../lib/diagramly/App.js');
require('../lib/diagramly/Menus.js');
require('../lib/diagramly/Pages.js');
require('../lib/diagramly/DistanceGuides.js');
require('../lib/diagramly/Minimal.js');
import Modals from './Modals.vue';

import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  PropType,
} from '@vue/composition-api';

const {
  mxCell,
  mxClipboard,
  mxCodec,
  mxConstants,
  mxEvent,
  mxEventSource,
  mxEventObject,
  mxGraphModel,
  mxObjectIdentity,
  mxPoint,
  mxResources,
  mxUtils,
} = require('../lib/jgraph/mxClient');

const defaultStyleXml = require('../styles/default.xml');
const resourcesFile = require('../locale/en.txt');
const DEFAULT_THEME = 'kennedy';

export type GraphEditorCell = typeof mxCell;

interface InsertLinkInfo {
  name?: string;
  type?: string;
  iconUrl?: string;
  noTitleCase?: boolean;
  noTruncateTitle?: boolean;
}

export interface RefreshedLinkInfo {
  url?: string;
  width?: number;
  height?: number;
}

interface GraphBounds {
  x?: number;
  y?: number;
  height?: number;
  width?: number;
}

import '../styles/main.scss';

export default defineComponent({
  name: 'GraphEditor',
  components: {
    Modals,
  },
  props: {
    shapeLibraries: {
      required: true,
      type: String,
    },
    scratchpadData: {
      required: true,
      type: String,
    },
    enabled: Boolean,
    theme: {
      required: false,
      type: String,
      default: DEFAULT_THEME,
    },
    refreshLinkHandler: {
      type: Function as PropType<(url: string) => Promise<RefreshedLinkInfo>> | null,
      required: false,
      default: null,
    },
  },

  setup(props, ctx) {
    const appRef = ref(null);

    const containerRef = ref(null);

    const editorUiRef = ref(null);

    const editorRef = ref(null);

    const graphRef = ref(null);

    const sidebarRef = ref(null);

    const pagesToRefresh = new Set();

    const pagesToFit = new Set();

    function loadImage(url: string): Promise<HTMLImageElement> {
      return new Promise((resolve) => {
        const image = new Image();
        image.addEventListener('load', () => {
          resolve(image);
        });

        image.onerror = () => {
          if (!url.startsWith('data:')) {
            ctx.emit('paste-text', url);
          }
        };
        image.src = url;
      });
    }

    function setGraphEnabled(enabled: boolean) {
      const editorUi = editorUiRef.value;
      const graph = graphRef.value;

      editorUi.setEnabled(enabled);
      /**
       * When scratchpad is enabled, open it when toggling from preview and
       * edit modes.
       */
      editorUi.openScratchpad();
      if (!enabled) {
        graph.clearSelection();
      }
    }

    function updateCellImage(
      cell: GraphEditorCell,
      imageUrl: string,
      width?: number,
      height?: number,
    ) {
      const graph = graphRef.value;

      graph.setCellStyles(mxConstants.STYLE_IMAGE, imageUrl, [cell]);

      if (width && height) {
        let geo = graph.getModel().getGeometry(cell);

        if (geo !== null) {
          geo = geo.clone();
          geo.width = width;
          geo.height = height;
          graph.getModel().setGeometry(cell, geo);
        }
      }
    }

    async function refreshCellLinks(cell: typeof mxCell) {
      const graph = graphRef.value;
      const style = graph.getCurrentCellStyle(cell);

      // Refresh the image links
      if (style[mxConstants.STYLE_SHAPE] === 'image') {
        const currentUrl = style[mxConstants.STYLE_IMAGE];
        const { url: imageUrl, width, height } = await props.refreshLinkHandler(
          style[mxConstants.STYLE_IMAGE],
        );
        if (imageUrl && currentUrl !== imageUrl) {
          updateCellImage(cell, imageUrl, width, height);
        }
      }

      // Refresh links for the objects
      const linkUrl = graph.getLinkForCell(cell);
      if (linkUrl) {
        const { url: newUrl } = await props.refreshLinkHandler(linkUrl);
        if (newUrl && linkUrl !== newUrl) {
          graph.setLinkForCell(cell, newUrl);
        }
      }

      cell.children?.forEach((child: typeof mxCell) => {
        refreshCellLinks(child);
      });
    }

    function refreshCurrentPageLinks() {
      const graph = graphRef.value;
      const editorUi = editorUiRef.value;

      if (!props.refreshLinkHandler || !props.enabled) {
        return;
      }

      const pageId = editorUi.getCurrentPage().getId();

      if (!pagesToRefresh.has(pageId)) {
        return;
      }

      pagesToRefresh.delete(pageId);

      refreshCellLinks(graph.model.getRoot());
    }

    function removePageFromCurrentPageWindow(
      _sender: typeof mxEventSource,
      pageId: typeof mxEventObject,
    ) {
      pagesToFit.delete(pageId.getProperty('pageId'));
    }

    function fitCurrentPageWindow() {
      const editorUi = editorUiRef.value;
      const graph = graphRef.value;

      const pageId: string = editorUi.getCurrentPage().getId();
      const bounds: GraphBounds = graph.isSelectionEmpty()
        ? graph.getGraphBounds()
        : graph.getBoundingBox(graph.getSelectionCells());
      const t: typeof mxPoint = graph.view.translate;
      const s: number = graph.view.scale;

      bounds.x = bounds.x / s - t.x;
      bounds.y = bounds.y / s - t.y;
      bounds.width /= s;
      bounds.height /= s;
      const border = 10;
      const padding = 20;

      const cw: number = graph.container.clientWidth - border;
      const ch: number = graph.container.clientHeight - border;
      const scale: number =
        Math.floor(padding * Math.min(cw / bounds.width, ch / bounds.height)) / padding;

      if (scale < 1 && !pagesToFit.has(pageId)) {
        graph.zoomTo(scale);

        if (mxUtils.hasScrollbars(graph.container)) {
          const p: typeof mxPoint = graph.view.translate;
          graph.container.scrollTop =
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            (bounds.y + p.y) * scale - Math.max((ch - bounds.height * scale) / 2 + border / 2, 0);
          graph.container.scrollLeft =
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            (bounds.x + p.x) * scale - Math.max((cw - bounds.width * scale) / 2 + border / 2, 0);
        }
        pagesToFit.add(pageId);
      } else if (!pagesToFit.has(pageId)) {
        pagesToFit.add(pageId);
      }
    }

    function onGraphChanged(_sender: typeof mxEventSource, event: typeof mxEventObject) {
      ctx.emit('graph-changed', event.name);
    }

    function onLibrariesChanged(_sender: typeof mxEventSource, event: typeof mxEventObject) {
      ctx.emit('shape-libraries-changed', event.getProperty('detail'));
    }

    function onScratchpadDataChanged(_sender: typeof mxEventSource, event: typeof mxEventObject) {
      ctx.emit('scratchpad-data-changed', event.getProperty('detail'));
    }

    function onThemeChanged(_sender: typeof mxEventSource, event: typeof mxEventObject) {
      ctx.emit('theme-changed', event.getProperty('detail'));
    }

    function onPageSelected(_sender: typeof mxEventSource) {
      refreshCurrentPageLinks();
    }

    function addListeners() {
      const editorUi = editorUiRef.value;
      const editor = editorRef.value;
      const graph = graphRef.value;

      graph.model.addListener(mxEvent.CHANGE, onGraphChanged);
      graph.addListener('gridSizeChanged', onGraphChanged);
      graph.addListener('graphChanged', onGraphChanged);
      editor.addListener('pageSelected', onPageSelected);
      editorUi.addListener('fitCurrentPageWindow', fitCurrentPageWindow);
      editorUi.addListener('shadowVisibleChanged', onGraphChanged);
      editorUi.addListener('gridEnabledChanged', onGraphChanged);
      editorUi.addListener('guidesEnabledChanged', onGraphChanged);
      editorUi.addListener('pageViewChanged', onGraphChanged);
      editorUi.addListener('connectionArrowsChanged', onGraphChanged);
      editorUi.addListener('connectionPointsChanged', onGraphChanged);
      editorUi.addListener('librariesChanged', onLibrariesChanged);
      editorUi.addListener('removePageFromCurrentPageWindow', removePageFromCurrentPageWindow);
      editorUi.addListener('scratchpadDataChanged', onScratchpadDataChanged);
      editorUi.addListener('themeChanged', onThemeChanged);
    }

    function removeListeners() {
      const editorUi = editorUiRef.value;
      const editor = editorRef.value;
      const graph = graphRef.value;

      graph.model.removeListener(onGraphChanged);
      graph.removeListener(onGraphChanged);
      editor.removeListener(onPageSelected);
      editorUi.removeListener(fitCurrentPageWindow);
      editorUi.removeListener(onGraphChanged);
      editorUi.removeListener(onLibrariesChanged);
      editorUi.removeListener(removePageFromCurrentPageWindow);
      editorUi.removeListener(onScratchpadDataChanged);
      editorUi.removeListener(onThemeChanged);
    }

    function getXmlData(): string {
      const app = appRef.value;

      app.currentFile.updateFileData();
      const xmlData = app.currentFile.getData();
      return xmlData;
    }

    function registerUndoListeners() {
      const debounceDelay = 200;
      const undoListener = debounce(() => {
        ctx.emit('on-undo', getXmlData());
      }, debounceDelay);

      const redoListener = debounce(() => {
        ctx.emit('on-redo', getXmlData());
      }, debounceDelay);

      const editor = editorRef.value;
      editor.undoManager.addListener(mxEvent.UNDO, undoListener);
      editor.undoManager.addListener(mxEvent.REDO, redoListener);
    }

    onMounted(() => {
      mxResources.loadDefaultBundle = false;
      mxResources.parse(resourcesFile);

      const parser = new DOMParser();
      const defaultStyleDoc = parser.parseFromString(defaultStyleXml, 'application/xml');

      const themes = {};
      themes[Graph.prototype.defaultThemeName] = defaultStyleDoc.documentElement;
      editorUiRef.value = createEditorUi(createEditor(themes), containerRef.value);
      editorRef.value = editorUiRef.value.editor;
      graphRef.value = editorRef.value.graph;
      sidebarRef.value = editorUiRef.value.sidebar;
      appRef.value = createApp(editorUiRef.value, editorRef.value, containerRef.value);

      // Add scratchpad to the sidebar
      editorUiRef.value.loadScratchpadData(props.scratchpadData);

      // Add stencils to the sidebar
      sidebarRef.value.showEntries(props.shapeLibraries);

      addListeners();

      nextTick(() => {
        setGraphEnabled(props.enabled);
        editorUiRef.value.resetViewToShowFullGraph();
        // TODO: Re-enable this when theme switching is all worked out
        // editorUiRef.value.theme = props.theme;
      });

      registerUndoListeners();
    });

    onBeforeUnmount(() => {
      const editorUi = editorUiRef.value;
      editorUi.resetPages();
      editorUi.closeOpenWindows();
      editorUi.destroy();
      removeListeners();
    });

    watch(
      () => props.scratchpadData,
      (val: string) => {
        editorUiRef.value.loadScratchpadData(val);
      },
    );

    watch(
      () => props.shapeLibraries,
      (val: string) => {
        sidebarRef.value.showEntries(val);
      },
    );

    // TODO: Re-enable this watch when theme switching is all worked out
    // watch(
    //   () => props.theme,
    //   (val: string) => {
    //     if (val !== editorUiRef.value.theme) {
    //       editorUiRef.value.theme = val;
    //       if (val === 'min') {
    //         editorUiRef.value.initTheme();
    //         editorUiRef.value.setEnabled(true);
    //         editorUiRef.value.menus.init();
    //         editorUiRef.value.init();
    //         editorUiRef.value.loadScratchpadData(props.scratchpadData);
    //         editorUiRef.value.actions.get('fitWindow').funct();
    //         editorUiRef.value.refresh();
    //       }
    //     }
    //   },
    // );

    async function canLoadFile(file: File): Promise<boolean> {
      const ext = file.name.split('.').pop();
      if (ext === 'draw' || ext === 'drawio' || ext === 'xml' || file.type.startsWith('text/')) {
        // Read start of file and see if it matches either <mxGraphModel or <
        const fileData = await file.text();
        if (fileData.startsWith('<mxfile ') || fileData.startsWith('<mxGraphModel ')) {
          return true;
        }
      }
      return false;
    }

    function loadXmlData(data: string) {
      const editorUi = editorUiRef.value;

      editorUi.openLocalFile(data, null, null, null, null);
      // Reset the view after loading a file
      nextTick(() => {
        setGraphEnabled(props.enabled);
        editorUi.resetViewToShowFullGraph();

        for (let i = 0; i < editorUi.pages.length; i++) {
          const page = editorUi.pages[i];
          pagesToRefresh.add(page.getId());
        }

        refreshCurrentPageLinks();
      });
    }

    function pasteShapes(doc: XMLDocument) {
      const codec = new mxCodec(doc);
      const model = new mxGraphModel();
      const graph = graphRef.value;
      const editorUi = editorUiRef.value;

      const rootElt = doc.documentElement.querySelector('root');
      // TODO: FIX!
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const cells = [];
      rootElt.querySelectorAll('mxCell').forEach((node) => {
        // skip the first 2 default elements in any graph doc
        if (node.id != '0' && node.id != '1') {
          cells.push(codec.decodeCell(node));
          // TODO: do we need this?
          // graph.refresh();
        }
      });

      // TODO: FIX!
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let result = cells;

      result = result || graph.getSelectionCells();
      result = graph.getExportableCells(graph.model.getTopmostCells(result));

      const cloneMap = new Object();
      const lookup = graph.createCellLookup(result);
      const clones = graph.cloneCells(result, null, cloneMap);

      // Uses temporary model to force new IDs to be assigned
      // to avoid having to carry over the mapping from object
      // ID to cell ID to the paste operation
      const parent = model.getChildAt(model.getRoot(), 0);

      for (let i = 0; i < clones.length; i++) {
        model.add(parent, clones[i]);

        // Checks for orphaned relative children and makes absolute
        const state = graph.view.getState(result[i]);

        if (state != null) {
          const geo = graph.getCellGeometry(clones[i]);

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

      // TODO: Is this the best way to insert a group of cells into the graph?
      mxClipboard.insertCount = 1;
      mxClipboard.setCells(clones);

      const pasteAction = editorUi.actions.get('paste');
      pasteAction.funct();

      // TODO: Is this needed?
      const copy = editorUi.actions.get('copy');
      copy.funct();
    }

    function paste(event: ClipboardEvent): boolean {
      const editorUi = editorUiRef.value;

      if (event) {
        // TODO: We should be able to call pasteCells from here and keep this simple. Check on that.
        const textData = event.clipboardData.getData('text');
        if (textData) {
          const decodedData = decodeURIComponent(textData);
          if (decodedData.startsWith('<mxGraphModel>') && decodedData.endsWith('</mxGraphModel>')) {
            const doc = mxUtils.parseXml(decodedData);
            try {
              pasteShapes(doc);
              return true;
            } finally {
              // do nothing
            }
          } else {
            editorUi.pasteCells(event, editorUi.textInputForNativeClipboard, true, true);
            return mxEvent.isConsumed(event);
          }
        }
      }
      return false;
    }

    async function insertImage(url: string, event?: MouseEvent): Promise<typeof mxCell> {
      const graph = graphRef.value;
      let cells = [];

      const image: HTMLImageElement = await loadImage(url);
      const { width, height } = image;
      let select = null;

      graphRef.value.getModel().beginUpdate();

      try {
        const insertPoint = event ? graph.getPointForEvent(event) : graph.getInsertPoint();

        cells = [
          graph.insertVertex(
            graph.getDefaultParent(),
            null,
            '',
            insertPoint.x,
            insertPoint.y,
            width,
            height,
            'shape=image;imageAspect=0;aspect=fixed;verticalLabelPosition=bottom;verticalAlign=top;',
          ),
        ];
        select = cells;
        graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select));

        const newUrl = url.replace(';base64', '');
        graph.setCellStyles(mxConstants.STYLE_IMAGE, newUrl.length > 0 ? newUrl : null, cells);

        // Sets shape only if not already shape with image (label or image)
        const style = graph.getCurrentCellStyle(cells[0]);

        if (
          style[mxConstants.STYLE_SHAPE] != 'image' &&
          style[mxConstants.STYLE_SHAPE] != 'label'
        ) {
          graph.setCellStyles(mxConstants.STYLE_SHAPE, 'image', cells);
        } else if (url.length === 0) {
          graph.setCellStyles(mxConstants.STYLE_SHAPE, null, cells);
        }
      } finally {
        graph.getModel().endUpdate();
      }

      if (select != null) {
        graph.setSelectionCells(select);
        // graph.scrollCellToVisible(select[0]);
      }

      return cells[0];
    }

    function insertLink(url: string) {
      const editorUi = editorUiRef.value;
      const action = editorUi.actions.get('insertLinkNoDialog');
      const docs: Array<InsertLinkInfo> = [];
      docs.push({ name: url, noTitleCase: true, noTruncateTitle: true });
      action.funct(url, docs);
    }

    function getStyleForFile(file: File) {
      const imageData = getImageData(file);
      return (
        'shape=image;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=0;aspect=fixed;image=data:image/svg+xml,' +
        imageData
      );
    }

    function insertFile(file: File, url: string, event?: MouseEvent) {
      const graph = graphRef.value;
      const parent = graph.getDefaultParent();
      const style = getStyleForFile(file);
      const shapeSize = 50;

      const insertPoint = event ? graph.getPointForEvent(event) : graph.getInsertPoint();

      const fileAttachmentCell = graph.insertVertex(
        parent,
        null,
        file.name,
        insertPoint.x,
        insertPoint.y,
        shapeSize,
        shapeSize,
        style,
      );
      graph.setLinkForCell(fileAttachmentCell, url);
    }

    function refreshUi() {
      editorUiRef.value?.refresh();
    }

    function showingDialog(): boolean {
      return !!editorUiRef.value?.dialog;
    }

    watch(
      () => props.enabled,
      (val) => {
        nextTick(() => {
          setGraphEnabled(val);
          editorUiRef.value.resetViewToShowFullGraph();
          refreshCurrentPageLinks();
        });
      },
    );

    return {
      appRef,
      canLoadFile,
      containerRef,
      editorRef,
      editorUiRef,
      fitCurrentPageWindow,
      getImageData,
      getStyleForFile,
      getXmlData,
      graphRef,
      insertImage,
      insertLink,
      insertFile,
      loadXmlData,
      loadImage,
      pagesToFit,
      paste,
      pasteShapes,
      refreshCurrentPageLinks,
      refreshUi,
      removePageFromCurrentPageWindow,
      setGraphEnabled,
      showingDialog,
      updateCellImage,
    };
  },
});
</script>

<template lang="pug">
.div
  .geEditor(ref='containerRef')
  modals(:editorUi='editorUiRef')
</template>
