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
import { createEditor } from '../lib/jgraph/Editor';
import { Graph } from '../lib/jgraph/Graph';
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from '@vue/composition-api';

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

import '../styles/grapheditor.scss';

export default defineComponent({
  name: 'GraphEditor',

  props: {
    shapeLibraries: {
      required: true,
      type: String,
    },
    enabled: Boolean,
  },

  setup(props, ctx) {
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
    }

    function onGraphChanged(_sender: typeof mxEventSource, event: typeof mxEventObject) {
      ctx.emit('graph-changed', event.name);
    }

    function addGraphChangedListeners() {
      graph.value.model.addListener(mxEvent.CHANGE, onGraphChanged);
      graph.value.addListener('gridSizeChanged', onGraphChanged);
      graph.value.addListener('graphChanged', onGraphChanged);
      editorUi.value.addListener('gridEnabledChanged', onGraphChanged);
      editorUi.value.addListener('guidesEnabledChanged', onGraphChanged);
      editorUi.value.addListener('pageViewChanged', onGraphChanged);
      editorUi.value.addListener('connectionArrowsChanged', onGraphChanged);
      editorUi.value.addListener('connectionPointsChanged', onGraphChanged);
    }

    function removeGraphChangedListeners() {
      graph.value.model.removeListener(onGraphChanged);
      graph.value.removeListener(onGraphChanged);
      editorUi.value.removeListener(onGraphChanged);
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

      // Add stencils to the sidebar
      sidebar.value.showEntries(props.shapeLibraries);

      addGraphChangedListeners();

      editorUi.value.container.addEventListener('librariesChanged', (event: CustomEvent) => {
        ctx.emit('shape-libraries-changed', event.detail);
      });

      nextTick(() => {
        setGraphEnabled(props.enabled);
        editorUi.value.fitToWindow();
      });
    });

    onBeforeUnmount(() => {
      editorUi.value.closeOpenWindows();
      removeGraphChangedListeners();
    });

    watch(
      () => props.shapeLibraries,
      (val: string) => {
        sidebar.value.showEntries(val);
      },
    );

    function getXmlData(): string {
      return mxUtils.getXml(editor.value.getGraphXml());
    }

    function loadXmlData(data: string) {
      // Import the XML data
      const doc = mxUtils.parseXml(data);
      editor.value.setGraphXml(doc.documentElement);
      editor.value.setModified(false);
      editor.value.undoManager.clear();

      // Reset the view after loading a file
      nextTick(() => {
        setGraphEnabled(props.enabled);
        editorUi.value.fitToWindow();
      });
    }

    function pasteShapes(doc: XMLDocument) {
      let codec = new mxCodec(doc);
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

      let cloneMap = new Object();
      let lookup = graph.value.createCellLookup(result);
      let clones = graph.value.cloneCells(result, null, cloneMap);

      // Uses temporary model to force new IDs to be assigned
      // to avoid having to carry over the mapping from object
      // ID to cell ID to the paste operation
      let parent = model.getChildAt(model.getRoot(), 0);

      for (let i = 0; i < clones.length; i++) {
        model.add(parent, clones[i]);

        // Checks for orphaned relative children and makes absolute
        let state = graph.value.view.getState(result[i]);

        if (state != null) {
          let geo = graph.value.getCellGeometry(clones[i]);

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

    watch(
      () => props.enabled,
      (val) => {
        nextTick(() => {
          setGraphEnabled(val);
          editorUi.value.fitToWindow();
        });
      },
    );

    return {
      container,
      editor,
      editorUi,
      getXmlData,
      graph,
      insertImage,
      insertLink,
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
