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

<template>
  <div ref="container" class="geEditor" @keydown.ctrl.83.prevent.stop="saveFile" />
</template>

<script>
import { mxConstants, mxEvent, mxEventObject, mxResources } from '@/lib/jgraph/mxClient';
import EditorUi from '@/lib/jgraph/EditorUi';
import { Editor } from '@/lib/jgraph/Editor';
import { getXml, importXml } from '@/lib/utils';
import Graph from '@/lib/jgraph/Graph';

const defaultStyleXml = require('@/styles/default.xml');
const resourcesFile = require('@/locale/grapheditor.txt');

export default {
  name: 'GraphEditor',
  data() {
    return {
      editorUi: null,
    };
  },
  mounted() {
    const drag = document.querySelector('.geEditor');
    mxEvent.addListener(drag, 'dragenter', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    mxEvent.addListener(drag, 'dragleave', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    mxEvent.addListener(drag, 'dragover', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    mxEvent.addListener(drag, 'drop', (e) => {
      e.stopPropagation();
      e.preventDefault();

      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        let file = e.dataTransfer.items[i].getAsFile();
        let fileInfo = {
          filename: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };
        this.$emit('file-dropped', fileInfo);

        // add image to graph
        const url =
          'https://static.scientificamerican.com/sciam/cache/file/4E0744CD-793A-4EF8-B550B54F7F2C4406_source.jpg';
        this.insertImage(url);
      }
    });

    // TEN9: add our own ctrl+v event listner
    drag.onpaste = (e) => {
      //check the event logs for temporary purpose
      debugger;
      console.log(e.clipboardData.getData('text/plain'));
      const action = this.editorUi.actions.get('paste');
      action.funct(null);
    };

    drag.oncopy = (e) => {
      //check the event logs for temporary purpose
      debugger;
      console.log(e.clipboardData.getData('text/plain'));
      // const action = this.editorUi.actions.get('paste');
      // action.funct(null);
    };

    mxResources.loadDefaultBundle = false;
    mxResources.parse(resourcesFile);

    const parser = new DOMParser();
    const defaultStyleDoc = parser.parseFromString(defaultStyleXml, 'application/xml');

    const themes = {};
    themes[Graph.prototype.defaultThemeName] = defaultStyleDoc.documentElement;
    this.editorUi = new EditorUi(new Editor(false, themes), this.$refs.container);
  },
  methods: {
    getXmlData() {
      return getXml(this.editorUi);
    },
    loadXmlData(data) {
      importXml(this.editorUi, data);
    },
    saveFile() {
      let xmlData = this.getXmlData();
      this.$emit('file-saved', xmlData);
    },
    insertImage(url) {
      let cells = this.editorUi.editor.graph.getSelectionCells();
      const w = 200;
      const h = 200;

      let select = null;

      this.editorUi.editor.graph.getModel().beginUpdate();

      let cellEditorStartEditing = this.editorUi.editor.graph.cellEditor.startEditing;

      this.editorUi.editor.graph.cellEditor.startEditing = () => {
        cellEditorStartEditing.apply(this, arguments);
        this.editorUi.updatePasteActionStates();
      };

      try {
        // Inserts new cell if no cell is selected
        if (cells.length == 0) {
          const pt = this.editorUi.editor.graph.getFreeInsertPoint();
          cells = [
            this.editorUi.editor.graph.insertVertex(
              this.editorUi.editor.graph.getDefaultParent(),
              null,
              '',
              pt.x,
              pt.y,
              w,
              h,
              'shape=image;imageAspect=0;aspect=fixed;verticalLabelPosition=bottom;verticalAlign=top;',
            ),
          ];
          select = cells;
          this.editorUi.editor.graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select));
        }

        this.editorUi.editor.graph.setCellStyles(
          mxConstants.STYLE_IMAGE,
          url.length > 0 ? url : null,
          cells,
        );

        // Sets shape only if not already shape with image (label or image)
        const style = this.editorUi.editor.graph.getCurrentCellStyle(cells[0]);

        if (
          style[mxConstants.STYLE_SHAPE] != 'image' &&
          style[mxConstants.STYLE_SHAPE] != 'label'
        ) {
          this.editorUi.editor.graph.setCellStyles(mxConstants.STYLE_SHAPE, 'image', cells);
        } else if (url.length == 0) {
          this.editorUi.editor.graph.setCellStyles(mxConstants.STYLE_SHAPE, null, cells);
        }
      } finally {
        this.editorUi.editor.graph.getModel().endUpdate();
      }

      if (select != null) {
        this.editorUi.editor.graph.setSelectionCells(select);
        this.editorUi.editor.graph.scrollCellToVisible(select[0]);
      }
    },
  },
};
</script>

<style lang="scss">
@import '../styles/grapheditor.css';
</style>
