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

import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from '@vue/composition-api';
// TEN9: file drop shape image data
import { icons } from '../lib/shapes/fileIcons.js';

const {
  mxClipboard,
  mxCodec,
  mxConstants,
  mxEvent,
  mxEventSource,
  mxEventObject,
  mxGraphModel,
  mxObjectIdentity,
  mxResources,
  mxUtils,
} = require('../lib/jgraph/mxClient');

const defaultStyleXml = require('../styles/default.xml');
const resourcesFile = require('../locale/en.txt');

interface InsertLinkInfo {
  name?: string;
  type?: string;
  iconUrl?: string;
  noTitleCase?: boolean;
  noTruncateTitle?: boolean;
}

interface EventFileInfo {
  filename?: string;
  size?: number;
  type?: string;
  lastModified?: number;
  what?: string;
}

interface FileLogEvent extends EventFileInfo {
  title: string;
}

import '../styles/main.scss';

export default defineComponent({
  name: 'GraphEditor',

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
      required: true,
      type: String,
    },
  },

  setup(props, ctx) {
    const app = ref(null);

    const container = ref(null);

    const editorUi = ref(null);

    const editor = ref(null);

    const graph = ref(null);

    const sidebar = ref(null);

    function loadImage(url: string): Promise<HTMLImageElement> {
      return new Promise((resolve) => {
        const image = new Image();
        image.addEventListener('load', () => {
          resolve(image);
        });

        image.onerror = () => {
          ctx.emit('paste-text', url);
        };
        image.src = url;
      });
    }

    function setGraphEnabled(enabled: boolean) {
      editorUi.value.setEnabled(enabled);
      /**
       * When scratchpad is enabled, open it when toggling from preview and
       * edit modes.
       */
      editorUi.value.openScratchpad();
      if (!enabled) {
        graph.value.clearSelection();
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

    function addListeners() {
      graph.value.model.addListener(mxEvent.CHANGE, onGraphChanged);
      graph.value.addListener('gridSizeChanged', onGraphChanged);
      graph.value.addListener('graphChanged', onGraphChanged);
      editorUi.value.addListener('shadowVisibleChanged', onGraphChanged);
      editorUi.value.addListener('gridEnabledChanged', onGraphChanged);
      editorUi.value.addListener('guidesEnabledChanged', onGraphChanged);
      editorUi.value.addListener('pageViewChanged', onGraphChanged);
      editorUi.value.addListener('connectionArrowsChanged', onGraphChanged);
      editorUi.value.addListener('connectionPointsChanged', onGraphChanged);
      editorUi.value.addListener('librariesChanged', onLibrariesChanged);
      editorUi.value.addListener('scratchpadDataChanged', onScratchpadDataChanged);
      editorUi.value.addListener('themeChanged', onThemeChanged);
    }

    function removeListeners() {
      graph.value.model.removeListener(onGraphChanged);
      graph.value.removeListener(onGraphChanged);
      editorUi.value.removeListener(onGraphChanged);
      editorUi.value.removeListener(onLibrariesChanged);
      editorUi.value.removeListener(onScratchpadDataChanged);
      editorUi.value.removeListener(onThemeChanged);
    }

    function getXmlData(): string {
      app.value.currentFile.updateFileData();
      const xmlData = app.value.currentFile.getData();
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

      editor.value.undoManager.addListener(mxEvent.UNDO, undoListener);
      editor.value.undoManager.addListener(mxEvent.REDO, redoListener);
    }

    onMounted(() => {
      mxResources.loadDefaultBundle = false;
      mxResources.parse(resourcesFile);

      const parser = new DOMParser();
      const defaultStyleDoc = parser.parseFromString(defaultStyleXml, 'application/xml');

      const themes = {};
      themes[Graph.prototype.defaultThemeName] = defaultStyleDoc.documentElement;
      editorUi.value = createEditorUi(createEditor(themes), container.value);
      editor.value = editorUi.value.editor;
      graph.value = editor.value.graph;
      sidebar.value = editorUi.value.sidebar;
      app.value = createApp(editorUi.value, editor.value, container.value);

      // Add scratchpad to the sidebar
      editorUi.value.loadScratchpadData(props.scratchpadData);

      // Add stencils to the sidebar
      sidebar.value.showEntries(props.shapeLibraries);

      addListeners();

      nextTick(() => {
        setGraphEnabled(props.enabled);
        editorUi.value.resetViewToShowFullGraph();
      });

      registerUndoListeners();
    });

    onBeforeUnmount(() => {
      editorUi.value.resetPages();
      editorUi.value.closeOpenWindows();
      removeListeners();
    });

    watch(
      () => props.scratchpadData,
      (val: string) => {
        editorUi.value.loadScratchpadData(val);
      },
    );

    watch(
      () => props.shapeLibraries,
      (val: string) => {
        sidebar.value.showEntries(val);
      },
    );

    watch(
      () => props.theme,
      (val: string) => {
        editorUi.value.theme = val;
        if (val === 'min') {
          editorUi.value.initTheme();
          editorUi.value.setEnabled(true);
          editorUi.value.menus.init();
          editorUi.value.init();
          editorUi.value.loadScratchpadData(props.scratchpadData);
          editorUi.value.actions.get('fitWindow').funct();
          editorUi.value.refresh();
        }
      },
    );

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
      editorUi.value.openLocalFile(data, null, null, null, null);
      // Reset the view after loading a file
      nextTick(() => {
        setGraphEnabled(props.enabled);
        editorUi.value.resetViewToShowFullGraph();
      });
    }

    function pasteShapes(doc: XMLDocument) {
      const codec = new mxCodec(doc);
      const model = new mxGraphModel();
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
          // graph.value.refresh();
        }
      });

      // TODO: FIX!
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let result = cells;

      result = result || graph.value.getSelectionCells();
      result = graph.value.getExportableCells(graph.value.model.getTopmostCells(result));

      const cloneMap = new Object();
      const lookup = graph.value.createCellLookup(result);
      const clones = graph.value.cloneCells(result, null, cloneMap);

      // Uses temporary model to force new IDs to be assigned
      // to avoid having to carry over the mapping from object
      // ID to cell ID to the paste operation
      const parent = model.getChildAt(model.getRoot(), 0);

      for (let i = 0; i < clones.length; i++) {
        model.add(parent, clones[i]);

        // Checks for orphaned relative children and makes absolute
        const state = graph.value.view.getState(result[i]);

        if (state != null) {
          const geo = graph.value.getCellGeometry(clones[i]);

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

      graph.value.updateCustomLinks(graph.value.createCellMapping(cloneMap, lookup), clones);

      // TODO: Is this the best way to insert a group of cells into the graph?
      mxClipboard.insertCount = 1;
      mxClipboard.setCells(clones);

      const pasteAction = editorUi.value.actions.get('paste');
      pasteAction.funct();

      // TODO: Is this needed?
      const copy = editorUi.value.actions.get('copy');
      copy.funct();
    }

    function paste(event: ClipboardEvent): boolean {
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
            editorUi.value.pasteCells(
              event,
              editorUi.value.textInputForNativeClipboard,
              true,
              true,
            );
            return mxEvent.isConsumed(event);
          }
        }
      }
      return false;
    }

    function insertImage(url: string) {
      let cells = [];

      loadImage(url).then((result: HTMLImageElement) => {
        const { width, height } = result;
        let select = null;

        graph.value.getModel().beginUpdate();

        try {
          // Inserts new cell if no cell is selected
          const pt = graph.value.getFreeInsertPoint();
          cells = [
            graph.value.insertVertex(
              graph.value.getDefaultParent(),
              null,
              '',
              pt.x,
              pt.y,
              width,
              height,
              'shape=image;imageAspect=0;aspect=fixed;verticalLabelPosition=bottom;verticalAlign=top;',
            ),
          ];
          select = cells;
          graph.value.fireEvent(new mxEventObject('cellsInserted', 'cells', select));

          graph.value.setCellStyles(mxConstants.STYLE_IMAGE, url.length > 0 ? url : null, cells);

          // Sets shape only if not already shape with image (label or image)
          const style = graph.value.getCurrentCellStyle(cells[0]);

          if (
            style[mxConstants.STYLE_SHAPE] != 'image' &&
            style[mxConstants.STYLE_SHAPE] != 'label'
          ) {
            graph.value.setCellStyles(mxConstants.STYLE_SHAPE, 'image', cells);
          } else if (url.length === 0) {
            graph.value.setCellStyles(mxConstants.STYLE_SHAPE, null, cells);
          }
        } finally {
          graph.value.getModel().endUpdate();
        }

        if (select != null) {
          graph.value.setSelectionCells(select);
          graph.value.scrollCellToVisible(select[0]);
        }
      });
    }

    function insertLink(url: string) {
      const action = editorUi.value.actions.get('insertLinkNoDialog');
      const docs: Array<InsertLinkInfo> = [];
      docs.push({ name: url, noTitleCase: true, noTruncateTitle: true });
      action.funct(url, docs);
    }

    function getDeafultImageData() {
      return 'shape=image;verticalLabelPosition=bottom;verticalAlign=top;imageAspect=0;aspect=fixed;image=data:image/svg+xml,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzkyIiBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiPjxwYXRoIGQ9Ik0xNTk2IDM4MHEyOCAyOCA0OCA3NnQyMCA4OHYxMTUycTAgNDAtMjggNjh0LTY4IDI4aC0xMzQ0cS00MCAwLTY4LTI4dC0yOC02OHYtMTYwMHEwLTQwIDI4LTY4dDY4LTI4aDg5NnE0MCAwIDg4IDIwdDc2IDQ4em0tNDQ0LTI0NHYzNzZoMzc2cS0xMC0yOS0yMi00MWwtMzEzLTMxM3EtMTItMTItNDEtMjJ6bTM4NCAxNTI4di0xMDI0aC00MTZxLTQwIDAtNjgtMjh0LTI4LTY4di00MTZoLTc2OHYxNTM2aDEyODB6Ii8+PC9zdmc+';
    }

    function getImageData(ext: string) {
      const icon = icons.filter((item) => {
        return item.extensions.includes(ext);
      });
      if (icon.length > 0) {
        return icon[0].imageData;
      } else {
        return getDeafultImageData();
      }
    }

    function getStyleForFile(file: FileLogEvent) {
      const ext = file.filename.split('.').pop();
      const imageData = getImageData(ext);
      console.log('data ', imageData);
      return imageData;
    }

    function insertFile(file: FileLogEvent, url: string) {
      const parent = graph.value.getDefaultParent();
      const style = getStyleForFile(file);
      const pt = graph.value.getFreeInsertPoint();
      const shapeSize = 50;
      const fileAttachmentCell = graph.value.insertVertex(
        parent,
        null,
        file.filename,
        pt.x,
        pt.y,
        shapeSize,
        shapeSize,
        style,
      );
      graph.value.setLinkForCell(fileAttachmentCell, url);
    }

    watch(
      () => props.enabled,
      (val) => {
        nextTick(() => {
          setGraphEnabled(val);
          editorUi.value.resetViewToShowFullGraph();
        });
      },
    );

    return {
      app,
      canLoadFile,
      container,
      editor,
      editorUi,
      getImageData,
      getStyleForFile,
      getXmlData,
      graph,
      insertImage,
      insertLink,
      insertFile,
      loadXmlData,
      loadImage,
      paste,
      pasteShapes,
      setGraphEnabled,
    };
  },
});
</script>

<template lang="pug">
.geEditor(ref='container')
</template>
