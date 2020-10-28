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
import { defineComponent, ref, onMounted } from '@vue/composition-api';

const {
  mxCodec,
  mxConstants,
  mxEvent,
  mxEventObject,
  mxGraphModel,
  mxResources,
  mxUtils,
} = require('../lib/jgraph/mxClient');

const defaultStyleXml = require('../styles/default.xml');
const resourcesFile = require('../locale/en.txt');

export interface EventFileInfo {
  filename: string;
  size: number;
  type: string;
  lastModified: number;
}

export default defineComponent({
  name: 'GraphEditor',

  setup(_props, ctx) {
    const container = ref(null);

    const editorUi = ref(null);

    const editor = ref(null);

    const graph = ref(null);

    onMounted(() => {
      const drag: HTMLElement = document.querySelector('.geEditor');

      mxEvent.addListener(drag, 'dragenter', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
      });
      mxEvent.addListener(drag, 'dragleave', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
      });
      mxEvent.addListener(drag, 'dragover', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
      });
      mxEvent.addListener(drag, 'drop', (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();

        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          const file = e.dataTransfer.items[i].getAsFile();
          const fileInfo: EventFileInfo = {
            filename: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          };
          ctx.emit('file-dropped', fileInfo);
        }
      });

      // TEN9: add our own ctrl+v event listener
      drag.onpaste = (e) => {
        // check if default clipboard have files or not
        if (e.clipboardData.files.length > 0) {
          for (let i = 0; i < e.clipboardData.files.length; i++) {
            const file = e.clipboardData.files[i];
            const fileInfo = {
              filename: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
            };
            ctx.emit('image-pasted', fileInfo);
          }
        } else {
          // if default clipboard doesn't have file then if act as normal paste
          const action = editorUi.value.actions.get('paste');
          action.funct();
        }
      };

      mxResources.loadDefaultBundle = false;
      mxResources.parse(resourcesFile);

      const parser = new DOMParser();
      const defaultStyleDoc = parser.parseFromString(defaultStyleXml, 'application/xml');

      const themes = {};
      themes[Graph.prototype.defaultThemeName] = defaultStyleDoc.documentElement;
      editorUi.value = createEditorUi(createEditor(themes), container.value);
      editor.value = editorUi.value.editor;
      graph.value = editor.value.graph;

      graph.value.model.addListener(mxEvent.CHANGE, () => {
        ctx.emit('graph-changed');
      });
    });

    function getXmlData(): string {
      return mxUtils.getXml(editor.value.getGraphXml());
    }

    function loadXmlData(data: string) {
      // Clear the graph before importing new cells
      const parent = graph.value.getDefaultParent();
      const cells = graph.value.getChildVertices(parent);
      graph.value.removeCells(cells);

      const doc = mxUtils.parseXml(data);
      const model = new mxGraphModel();
      const codec = new mxCodec(doc);
      codec.decode(doc.documentElement, model);

      const children = model.getChildren(model.getChildAt(model.getRoot(), 0));
      if (children) {
        graph.value.importCells(children);
      }
    }

    function saveFile() {
      const xmlData = getXmlData();
      ctx.emit('file-saved', xmlData);
    }

    function loadImage(url: string): Promise<HTMLImageElement> {
      /*
       * We are going to return a Promise which, when we then
       * will give us an Image that should be fully loaded
       */
      return new Promise((resolve) => {
        const image = new Image();
        image.addEventListener('load', () => {
          resolve(image);
        });
        image.src = url;
      });
    }

    function insertImage(url: string) {
      let cells = [];

      loadImage(url).then((result: HTMLImageElement) => {
        const { width, height } = result;
        let select = null;

        graph.value.getModel().beginUpdate();

        let cellEditorStartEditing = graph.value.cellEditor.startEditing;

        graph.value.cellEditor.startEditing = () => {
          cellEditorStartEditing.apply(ctx, arguments);
          editorUi.value.updatePasteActionStates();
        };

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

        let scroll = document.getElementById('scroll');
        scroll.scrollTop = scroll.scrollHeight - scroll.clientHeight;
      });
    }

    return {
      container,
      editor,
      editorUi,
      getXmlData,
      graph,
      insertImage,
      loadXmlData,
      saveFile,
    };
  },
});
</script>

<template lang="pug">
.geEditor(ref='container', @keydown.ctrl.83.prevent.stop='saveFile')
</template>

<style lang="scss">
@import '../styles/grapheditor.css';
</style>
