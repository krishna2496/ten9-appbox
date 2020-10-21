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
import Graph from '../lib/jgraph/Graph';
import { defineComponent, ref, onMounted } from '@vue/composition-api';

const { mxCodec, mxEvent, mxGraphModel, mxResources, mxUtils } = require('../lib/jgraph/mxClient');

const defaultStyleXml = require('../styles/default.xml');
const resourcesFile = require('../locale/en.txt');

export default defineComponent({
  name: 'GraphEditor',

  setup(_props, ctx) {
    const container = ref(null);

    const editorUi = ref(null);

    const editor = ref(null);

    const graph = ref(null);

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

    return {
      container,
      editor,
      editorUi,
      getXmlData,
      graph,
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
